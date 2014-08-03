"use strict";

angular.module('arethusa.comments').service('comments', [
  'state',
  'configurator',
  'navigator',
  'notifier',
  function(state, configurator, navigator, notifier) {
    var self = this;
    var retriever, persister;
    var idMap;
    var commentIndex;
    var reverseIndex;
    var fullTextIndex;

    this.filter = {};

    this.defaultConf = {
      name: "comments",
      template: "templates/arethusa.comments/comments.html"
    };

    function configure() {
      configurator.getConfAndDelegate('comments', self);
      retriever = configurator.getRetriever(self.conf.retriever);
      persister = retriever;
    }

    configure();

    function retrieveComments() {
      self.comments = [];
      retriever.getData(navigator.status.currentId, function(comments) {
        self.comments = comments;
        createIndices();
      });
    }

    function fullText(commentContainer) {
      return arethusaUtil.map(commentContainer.comments, function(el) {
        return el.comment;
      }).join(' ');
    }

    function addToIndex(commentContainer) {
      var ids = commentContainer.ids;
      var id = ids.join('|'); // using a . would interfere with aU.setProperty
      commentIndex[id] = commentContainer;
      fullTextIndex.add({ id: id, body: fullText(commentContainer) });

      angular.forEach(ids, function(tId) {
        arethusaUtil.setProperty(reverseIndex, tId + '.' + id, true);
      });
    }

    function lunrIndex() {
      return lunr(function() {
        this.field('body');
        this.ref('id');
      });
    }

    function createIndices() {
      commentIndex = {};
      reverseIndex = {};
      fullTextIndex = lunrIndex();
      angular.forEach(self.comments, addToIndex);
    }

    function getFromIndex(ids) {
      return arethusaUtil.map(ids, function(el) {
        return commentIndex[el];
      });
    }

    function selectionFilter() {
      var targets = {};
      angular.forEach(state.selectedTokens, function(token, id) {
        angular.extend(targets, reverseIndex[id]);
      });
      return Object.keys(targets).sort();
    }

    function searchText(txt, otherIds) {
      // A former filter returned empty, so we can just return,
      // but it could also be that this fn is the first filter
      // applied.
      if (otherIds && !otherIds.length) return otherIds;

      var hits = fullTextIndex.search(txt);
      var ids = arethusaUtil.map(hits, function(el) { return el.ref; });
      return otherIds ? arethusaUtil.intersect(ids, otherIds) : ids;
    }

    function filteredComments() {
      var sel = self.filter.selection;
      var txt = self.filter.fullText;

      if (sel || txt) {
        var ids;
        if (sel) { ids = selectionFilter(); }
        if (txt) { ids = searchText(txt, ids); }
        return getFromIndex(ids);
      }
    }

    this.currentComments = function() {
      return filteredComments() || self.comments;
    };

    this.commentCountFor = function(token) {
      var count = 0;
      var commentIds = reverseIndex[token.id];
      if (commentIds) {
        var idArr = Object.keys(commentIds);
        angular.forEach(getFromIndex(idArr), function(commentObj) {
          count = count + commentObj.comments.length;
        });
      }
      return count;
    };

    function Comment(ids, sId, comment, type) {
      this.ids = ids;
      this.sId = sId;
      this.comment = comment;
    }

    function saveSuccess(fn) {
      return function(commentContainer) {
        addToIndex(commentContainer);
        fn();
        notifier.success('Comment created!');
      };
    }

    function saveError() {
      notifier.error('Failed to create comment');
    }

    this.createNewComment = function(ids, comment, successFn) {
      var newComment = new Comment(ids, navigator.status.currentId, comment);
      persister.saveData(newComment, saveSuccess(successFn), saveError);
    };

    this.init = function() {
      configure();
      retrieveComments();
    };
  }
]);

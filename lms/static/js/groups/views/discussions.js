(function(define) {
    'use strict';
    define(['jquery', 'underscore', 'backbone', 'gettext',
        'js/groups/views/divided_discussions_inline', 'js/groups/views/divided_discussions_course_wide',
        'edx-ui-toolkit/js/utils/html-utils',
        'string_utils'],

        function($, _, Backbone, gettext, InlineDiscussionsView, CourseWideDiscussionsView, HtmlUtils) {
            var hiddenClass = 'is-hidden';

            var DiscussionsView = Backbone.View.extend({
                events: {
                    'click .division-scheme': 'divisionSchemeChanged'
                },

                initialize: function(options) {
                    this.template = HtmlUtils.template($('#discussions-tpl').text());
                    this.context = options.context;
                    this.discussionSettings = options.discussionSettings;
                },

                render: function() {
                    HtmlUtils.setHtml(this.$el, this.template({availableSchemes: this.getDivisionSchemeData()}));
                    this.divisionSchemeChanged();
                    this.showDiscussionTopics();
                    return this;
                },

                getDivisionSchemeData: function() {
                    // TODO: get available schemes and currently selected scheme from this.discussionSettings
                    return [
                        {
                            key: 'none',
                            displayName: gettext('Not divided'),
                            descriptiveText: gettext('Discussions are unified; all learners interact with posts from other learners, regardless of the group they are in.'),
                            selected: false
                        },
                        {
                            key: 'enrollment_track',
                            displayName: gettext('Enrollment Tracks'),
                            descriptiveText: gettext('Use enrollment tracks as the basis for dividing discussions. All learners, regardless of their enrollment track, see the same discussion topics, but within divided topics, only learners who are in the same enrollment track see and respond to each others’ posts.'),
                            selected: false
                        },
                        {
                            key: 'cohort',
                            displayName: gettext('Cohorts'),
                            descriptiveText: gettext('Use cohorts as the basis for dividing discussions. All learners, regardless of cohort, see the same discussion topics, but within divided topics, only members of the same cohort see and respond to each others’ posts. '),
                            selected: true
                        }

                    ];
                },

                divisionSchemeChanged: function() {
                    var selectedScheme = this.$('input[name="division-scheme"]:checked').val(),
                        topicNav = this.$('.topic-division-nav'),
                        messageSpan = this.$('.division-scheme-message');

                    this.hideTopicNav(selectedScheme, topicNav);
                    this.showSelectMessage(selectedScheme, messageSpan);

                },

                hideTopicNav: function(selectedScheme, topicNav) {
                    if (selectedScheme === 'none') {
                        topicNav.addClass(hiddenClass);
                    } else {
                        topicNav.removeClass(hiddenClass);
                    }
                },

                showSelectMessage: function(selectedScheme, messageSpan) {
                    // TODO need to call the proper template text based on selectedScheme
                    switch (selectedScheme) {
                        case 'none':
                            messageSpan.text(gettext('Discussion topics in the course are not divided.'));
                            break;
                        case 'enrollment_track':
                            messageSpan.text(gettext('Any divided discussion topics are divided based on enrollment track.'));
                            break;
                        case 'cohort':
                            messageSpan.text(gettext('Any divided discussion topics are divided based on cohort.'));
                            break;
                    }
                },

                getSectionCss: function(section) {
                    return ".instructor-nav .nav-item [data-section='" + section + "']";
                },

                showDiscussionTopics: function() {
                    var dividedDiscussionsElement = this.$('.discussions-nav');
                    if (!this.CourseWideDiscussionsView) {
                        this.CourseWideDiscussionsView = new CourseWideDiscussionsView({
                            el: dividedDiscussionsElement,
                            model: this.context.discussionTopicsSettingsModel,
                            discussionSettings: this.discussionSettings
                        }).render();
                    }

                    if (!this.InlineDiscussionsView) {
                        this.InlineDiscussionsView = new InlineDiscussionsView({
                            el: dividedDiscussionsElement,
                            model: this.context.discussionTopicsSettingsModel,
                            discussionSettings: this.discussionSettings
                        }).render();
                    }
                }
            });
            return DiscussionsView;
        });
}).call(this, define || RequireJS.define);

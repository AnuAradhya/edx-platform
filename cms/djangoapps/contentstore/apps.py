"""
Contentstore Application Configuration

Above-modulestore level signal handlers are connected here.
"""

from django.apps import AppConfig


class ContentstoreConfig(AppConfig):
    """
    Application Configuration for Grades.
    """
    # A Test, may not be needed
    name = u'cms.djangoapps.contentstore.signals'

    def ready(self):
        """
        Connect handlers to signals.
        """
        # Can't import models at module level in AppConfigs, and models get
        # included from the signal handlers
        from .signals import handlers  # pylint: disable=unused-variable

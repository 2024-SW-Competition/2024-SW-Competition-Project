from django.db import models
from django.utils import timezone
from teams.models import UserTeamProfile, Team


# Create your models here.
class Home(models.Model):
  team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='homes')
  goal = models.CharField(max_length=500)
  date = models.PositiveIntegerField(default=1)
  start_date = models.DateField(default=timezone.now)
  positions = models.JSONField(default=dict)
  is_end = models.BooleanField(default=False)
  invitation_num = models.CharField(max_length=10, null=True, blank=True)

  def __str__(self):
    return self.goal
-- Magic Transitions for SKATERs and GOALTENDERs / Hit the road for SKATERS (by score and time)
select ranking.sequence, team.name, player.shirt_number, player.first_name, player.last_name, 
	rating.score, result.time, result.failures
from skillranking ranking, skill skill, player player, team team, tournament tourn, skillresult result, skillrating rating
where ranking.player_id = player.id and ranking.skill_id = skill.id and player.team_id = team.id
and ranking.skill_id = result.skill_id and ranking.player_id = result.player_id
and ranking.skill_id = rating.skill_id and ranking.player_id = rating.player_id
and skill.tournament_id = 1 AND skill.number = 1 and player.position = 'SKATER'
order by ranking.sequence asc;

-- Best shot (by points): for SKATERs and GOALTENDERs
select ranking.sequence, team.name, player.shirt_number, player.first_name, player.last_name, result.points, result.failures
from skillranking ranking, skill skill, player player, team team, tournament tourn, skillresult result
where ranking.player_id = player.id and ranking.skill_id = skill.id and player.team_id = team.id
and ranking.skill_id = result.skill_id and ranking.player_id = result.player_id
and skill.tournament_id = 1 AND skill.number = 2 and player.position = 'SKATER'
order by ranking.sequence asc;

-- Pass and go (by points and time): for SKATERs and GOALTENDERs
select ranking.sequence, team.name, player.shirt_number, player.first_name, player.last_name, result.points, result.time, result.failures
from skillranking ranking, skill skill, player player, team team, tournament tourn, skillresult result
where ranking.player_id = player.id and ranking.skill_id = skill.id and player.team_id = team.id
and ranking.skill_id = result.skill_id and ranking.player_id = result.player_id
and skill.tournament_id = 1 AND skill.number = 3 and player.position = 'SKATER'
order by ranking.sequence asc;

-- Pass and go (by time): for SKATERs
select ranking.sequence, team.name, player.shirt_number, player.first_name, player.last_name, result.time, result.failures
from skillranking ranking, skill skill, player player, team team, tournament tourn, skillresult result
where ranking.player_id = player.id and ranking.skill_id = skill.id and player.team_id = team.id
and ranking.skill_id = result.skill_id and ranking.player_id = result.player_id
and skill.tournament_id = 1 AND skill.number = 4 and player.position = 'SKATER'
order by ranking.sequence asc;

-- Pass and go / Hit the road (by score): for GOALTENDERs
select ranking.sequence, team.name, player.shirt_number, player.first_name, player.last_name, rating.score
from skillranking ranking, skill skill, player player, team team, tournament tourn, skillrating rating
where ranking.player_id = player.id and ranking.skill_id = skill.id and player.team_id = team.id
and ranking.skill_id = rating.skill_id and ranking.player_id = rating.player_id
and skill.tournament_id = 1 AND skill.number = 5 and player.position = 'GOALTENDER'
order by ranking.sequence asc;

-- Goaltenders overall: for GOALTENDERs
select ranking.sequence, team.name, player.shirt_number, player.first_name, player.last_name
from skillranking ranking, skill skill, player player, team team, tournament tourn
where ranking.player_id = player.id and ranking.skill_id = skill.id and player.team_id = team.id
and skill.tournament_id = 1 AND skill.number = 6 and player.position = 'GOALTENDER'
order by ranking.sequence asc;
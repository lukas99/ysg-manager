create table skill (
	id bigint primary key,
	tournament_id bigint not null,
	type_for_players text not null,
	type_for_goaltenders text not null,
    tournament_ranking_player_position text not null,
	name text not null,
	number integer default null,
	created timestamp not null,
	created_by text not null,
	modified timestamp not null,
	modified_by text not null
);

alter table skill 
add constraint skill_tournament_fk foreign key (tournament_id) references tournament;

create table player (
	id bigint primary key,
	team_id bigint not null,
	first_name text default null,
	last_name text default null,
	shirt_number integer not null,
	position text not null,
	created timestamp not null,
	created_by text not null,
	modified timestamp not null,
	modified_by text not null
);

alter table player 
add constraint player_team_fk foreign key (team_id) references team;
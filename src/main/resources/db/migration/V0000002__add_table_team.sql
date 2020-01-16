create table team (
	id bigint primary key,
	tournament_id bigint not null,
	name text not null,
	logo bytea default null,
	created timestamp not null,
	created_by text not null,
	modified timestamp not null,
	modified_by text not null
);

alter table team 
add constraint team_tournament_fk foreign key (tournament_id) references tournament;
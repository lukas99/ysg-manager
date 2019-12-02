create table skillrating (
	id bigint primary key,
	skill_id bigint not null,
	player_id bigint not null,
	score integer not null,
	created timestamp not null,
	modified timestamp not null
);

alter table skillrating
add constraint skillrating_skill_fk foreign key (skill_id) references skill;

alter table skillrating
add constraint skillrating_player_fk foreign key (player_id) references player;
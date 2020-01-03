create table skillresult (
	id bigint primary key,
	skill_id bigint not null,
	player_id bigint not null,
	time integer default null,
	failures integer default null,
	points integer default null,
	created timestamp not null,
	createdBy text not null,
	modified timestamp not null,
	modifiedBy text not null
);

alter table skillresult
add constraint skillresult_skill_fk foreign key (skill_id) references skill;

alter table skillresult
add constraint skillresult_player_fk foreign key (player_id) references player;
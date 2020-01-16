create table tournament (
	id bigint primary key,
	name text not null,
	date_description text default null,
	created timestamp not null,
	created_by text not null,
	modified timestamp not null,
	modified_by text not null
);
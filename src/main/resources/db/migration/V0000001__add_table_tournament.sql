create table tournament (
	id bigint primary key,
	name text not null,
	date_description text default null,
	created timestamp not null,
	createdBy text not null,
	modified timestamp not null,
	modifiedBy text not null
);
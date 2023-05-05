-- this data will only be loaded when an embedded database like H2 is configured

INSERT INTO tournament(id, name, date_description, created, created_by, modified, modified_by,active)
VALUES (1000, 'YSG 2021', '2021', '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch', true);

INSERT INTO team(id, tournament_id, name, logo, created, created_by, modified, modified_by)
VALUES
    (2000, 1000, 'EHC Burgdorf', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (2001, 1000, 'HC Ambri Piotta', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (2002, 1000, 'GCK/ZSC Lions', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (2003, 1000, 'EHC Engelberg', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (2004, 1000, 'SC Bern Future', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (2005, 1000, 'EV Zug', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (2006, 1000, 'HC Lugano', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (2007, 1000, 'HC Seewen', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (2008, 1000, 'HC Davos', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (2009, 1000, 'HC Luzern', null, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch','2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch');

INSERT INTO skill(id, tournament_id, type_for_players, type_for_goaltenders, tournament_ranking_player_position, name, number, created, created_by, modified, modified_by)
VALUES
    (3001, 1000, '0', '0', '0', 'Magic Transitions', 1, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch', '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (3002, 1000, '3', '3', '0', 'Best Shot', 2, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch', '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (3003, 1000, '1', '1', '0', 'Pass and Go', 3, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch', '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (3004, 1000, '2', '4', '0', 'Controlled Jumble', 4, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch', '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (3005, 1000, '0', '4', '0', 'Hit the Road', 5, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch', '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch'),
    (3006, 1000, '6', '5', '1', 'Torhüter', 6, '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch', '2023-01-01 08:00:00.00', 'l.eberli@sunrise.ch');

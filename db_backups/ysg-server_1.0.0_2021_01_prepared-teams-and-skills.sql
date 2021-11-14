PGDMP     3                 
    y         
   ysg-server    11.4 (Debian 11.4-1.pgdg90+1)    12.0 2    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    41082 
   ysg-server    DATABASE     |   CREATE DATABASE "ysg-server" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';
    DROP DATABASE "ysg-server";
                postgres    false            �            1259    41083    flyway_schema_history    TABLE     �  CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);
 )   DROP TABLE public.flyway_schema_history;
       public            postgres    false            �            1259    41093    hibernate_sequence    SEQUENCE     {   CREATE SEQUENCE public.hibernate_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.hibernate_sequence;
       public          postgres    false            �            1259    41116    player    TABLE     `  CREATE TABLE public.player (
    id bigint NOT NULL,
    team_id bigint NOT NULL,
    first_name text,
    last_name text,
    shirt_number integer NOT NULL,
    "position" text NOT NULL,
    created timestamp without time zone NOT NULL,
    created_by text NOT NULL,
    modified timestamp without time zone NOT NULL,
    modified_by text NOT NULL
);
    DROP TABLE public.player;
       public            postgres    false            �            1259    41129    skill    TABLE     �  CREATE TABLE public.skill (
    id bigint NOT NULL,
    tournament_id bigint NOT NULL,
    type_for_players text NOT NULL,
    type_for_goaltenders text NOT NULL,
    tournament_ranking_player_position text NOT NULL,
    name text NOT NULL,
    number integer,
    created timestamp without time zone NOT NULL,
    created_by text NOT NULL,
    modified timestamp without time zone NOT NULL,
    modified_by text NOT NULL
);
    DROP TABLE public.skill;
       public            postgres    false            �            1259    41185    skillranking    TABLE     V  CREATE TABLE public.skillranking (
    id bigint NOT NULL,
    skill_id bigint NOT NULL,
    player_id bigint NOT NULL,
    rank integer NOT NULL,
    sequence integer NOT NULL,
    created timestamp without time zone NOT NULL,
    created_by text NOT NULL,
    modified timestamp without time zone NOT NULL,
    modified_by text NOT NULL
);
     DROP TABLE public.skillranking;
       public            postgres    false            �            1259    41142    skillrating    TABLE     <  CREATE TABLE public.skillrating (
    id bigint NOT NULL,
    skill_id bigint NOT NULL,
    player_id bigint NOT NULL,
    score numeric(5,2) NOT NULL,
    created timestamp without time zone NOT NULL,
    created_by text NOT NULL,
    modified timestamp without time zone NOT NULL,
    modified_by text NOT NULL
);
    DROP TABLE public.skillrating;
       public            postgres    false            �            1259    41160    skillresult    TABLE     t  CREATE TABLE public.skillresult (
    id bigint NOT NULL,
    skill_id bigint NOT NULL,
    player_id bigint NOT NULL,
    "time" numeric(5,2) DEFAULT NULL::numeric,
    failures integer,
    points integer,
    created timestamp without time zone NOT NULL,
    created_by text NOT NULL,
    modified timestamp without time zone NOT NULL,
    modified_by text NOT NULL
);
    DROP TABLE public.skillresult;
       public            postgres    false            �            1259    41205    skilltournamentranking    TABLE     `  CREATE TABLE public.skilltournamentranking (
    id bigint NOT NULL,
    skill_id bigint NOT NULL,
    player_id bigint NOT NULL,
    rank integer NOT NULL,
    sequence integer NOT NULL,
    created timestamp without time zone NOT NULL,
    created_by text NOT NULL,
    modified timestamp without time zone NOT NULL,
    modified_by text NOT NULL
);
 *   DROP TABLE public.skilltournamentranking;
       public            postgres    false            �            1259    41103    team    TABLE     "  CREATE TABLE public.team (
    id bigint NOT NULL,
    tournament_id bigint NOT NULL,
    name text NOT NULL,
    logo bytea,
    created timestamp without time zone NOT NULL,
    created_by text NOT NULL,
    modified timestamp without time zone NOT NULL,
    modified_by text NOT NULL
);
    DROP TABLE public.team;
       public            postgres    false            �            1259    41095 
   tournament    TABLE       CREATE TABLE public.tournament (
    id bigint NOT NULL,
    name text NOT NULL,
    date_description text,
    created timestamp without time zone NOT NULL,
    created_by text NOT NULL,
    modified timestamp without time zone NOT NULL,
    modified_by text NOT NULL
);
    DROP TABLE public.tournament;
       public            postgres    false            �          0    41083    flyway_schema_history 
   TABLE DATA           �   COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
    public          postgres    false    196   G       �          0    41116    player 
   TABLE DATA           �   COPY public.player (id, team_id, first_name, last_name, shirt_number, "position", created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    200   �H       �          0    41129    skill 
   TABLE DATA           �   COPY public.skill (id, tournament_id, type_for_players, type_for_goaltenders, tournament_ranking_player_position, name, number, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    201   �H       �          0    41185    skillranking 
   TABLE DATA           {   COPY public.skillranking (id, skill_id, player_id, rank, sequence, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    204   �I       �          0    41142    skillrating 
   TABLE DATA           q   COPY public.skillrating (id, skill_id, player_id, score, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    202   J       �          0    41160    skillresult 
   TABLE DATA           �   COPY public.skillresult (id, skill_id, player_id, "time", failures, points, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    203   5J       �          0    41205    skilltournamentranking 
   TABLE DATA           �   COPY public.skilltournamentranking (id, skill_id, player_id, rank, sequence, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    205   RJ       �          0    41103    team 
   TABLE DATA           i   COPY public.team (id, tournament_id, name, logo, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    199   oJ       �          0    41095 
   tournament 
   TABLE DATA           l   COPY public.tournament (id, name, date_description, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    198   �K       �           0    0    hibernate_sequence    SEQUENCE SET     A   SELECT pg_catalog.setval('public.hibernate_sequence', 17, true);
          public          postgres    false    197            �
           2606    41091 .   flyway_schema_history flyway_schema_history_pk 
   CONSTRAINT     x   ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);
 X   ALTER TABLE ONLY public.flyway_schema_history DROP CONSTRAINT flyway_schema_history_pk;
       public            postgres    false    196            �
           2606    41123    player player_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    200            �
           2606    41136    skill skill_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.skill DROP CONSTRAINT skill_pkey;
       public            postgres    false    201            �
           2606    41192    skillranking skillranking_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.skillranking
    ADD CONSTRAINT skillranking_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.skillranking DROP CONSTRAINT skillranking_pkey;
       public            postgres    false    204            �
           2606    41149    skillrating skillrating_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.skillrating
    ADD CONSTRAINT skillrating_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.skillrating DROP CONSTRAINT skillrating_pkey;
       public            postgres    false    202            �
           2606    41168    skillresult skillresult_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.skillresult
    ADD CONSTRAINT skillresult_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.skillresult DROP CONSTRAINT skillresult_pkey;
       public            postgres    false    203            �
           2606    41212 2   skilltournamentranking skilltournamentranking_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.skilltournamentranking
    ADD CONSTRAINT skilltournamentranking_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.skilltournamentranking DROP CONSTRAINT skilltournamentranking_pkey;
       public            postgres    false    205            �
           2606    41110    team team_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.team DROP CONSTRAINT team_pkey;
       public            postgres    false    199            �
           2606    41102    tournament tournament_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT tournament_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.tournament DROP CONSTRAINT tournament_pkey;
       public            postgres    false    198            �
           2606    41180 '   player unique_player_teamid_shirtnumber 
   CONSTRAINT     s   ALTER TABLE ONLY public.player
    ADD CONSTRAINT unique_player_teamid_shirtnumber UNIQUE (team_id, shirt_number);
 Q   ALTER TABLE ONLY public.player DROP CONSTRAINT unique_player_teamid_shirtnumber;
       public            postgres    false    200    200            �
           2606    41204 1   skillranking unique_skillranking_skillid_playerid 
   CONSTRAINT     {   ALTER TABLE ONLY public.skillranking
    ADD CONSTRAINT unique_skillranking_skillid_playerid UNIQUE (skill_id, player_id);
 [   ALTER TABLE ONLY public.skillranking DROP CONSTRAINT unique_skillranking_skillid_playerid;
       public            postgres    false    204    204            �
           2606    41182 /   skillrating unique_skillrating_skillid_playerid 
   CONSTRAINT     y   ALTER TABLE ONLY public.skillrating
    ADD CONSTRAINT unique_skillrating_skillid_playerid UNIQUE (skill_id, player_id);
 Y   ALTER TABLE ONLY public.skillrating DROP CONSTRAINT unique_skillrating_skillid_playerid;
       public            postgres    false    202    202            �
           2606    41184 /   skillresult unique_skillresult_skillid_playerid 
   CONSTRAINT     y   ALTER TABLE ONLY public.skillresult
    ADD CONSTRAINT unique_skillresult_skillid_playerid UNIQUE (skill_id, player_id);
 Y   ALTER TABLE ONLY public.skillresult DROP CONSTRAINT unique_skillresult_skillid_playerid;
       public            postgres    false    203    203            �
           2606    41224 E   skilltournamentranking unique_skilltournamentranking_skillid_playerid 
   CONSTRAINT     �   ALTER TABLE ONLY public.skilltournamentranking
    ADD CONSTRAINT unique_skilltournamentranking_skillid_playerid UNIQUE (skill_id, player_id);
 o   ALTER TABLE ONLY public.skilltournamentranking DROP CONSTRAINT unique_skilltournamentranking_skillid_playerid;
       public            postgres    false    205    205            �
           1259    41092    flyway_schema_history_s_idx    INDEX     `   CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);
 /   DROP INDEX public.flyway_schema_history_s_idx;
       public            postgres    false    196            �
           2606    41124    player player_team_fk    FK CONSTRAINT     s   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_team_fk FOREIGN KEY (team_id) REFERENCES public.team(id);
 ?   ALTER TABLE ONLY public.player DROP CONSTRAINT player_team_fk;
       public          postgres    false    2789    199    200            �
           2606    41137    skill skill_tournament_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_tournament_fk FOREIGN KEY (tournament_id) REFERENCES public.tournament(id);
 C   ALTER TABLE ONLY public.skill DROP CONSTRAINT skill_tournament_fk;
       public          postgres    false    2787    201    198                       2606    41198 #   skillranking skillranking_player_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillranking
    ADD CONSTRAINT skillranking_player_fk FOREIGN KEY (player_id) REFERENCES public.player(id);
 M   ALTER TABLE ONLY public.skillranking DROP CONSTRAINT skillranking_player_fk;
       public          postgres    false    200    2791    204                       2606    41193 "   skillranking skillranking_skill_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillranking
    ADD CONSTRAINT skillranking_skill_fk FOREIGN KEY (skill_id) REFERENCES public.skill(id);
 L   ALTER TABLE ONLY public.skillranking DROP CONSTRAINT skillranking_skill_fk;
       public          postgres    false    201    204    2795                        2606    41155 !   skillrating skillrating_player_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillrating
    ADD CONSTRAINT skillrating_player_fk FOREIGN KEY (player_id) REFERENCES public.player(id);
 K   ALTER TABLE ONLY public.skillrating DROP CONSTRAINT skillrating_player_fk;
       public          postgres    false    2791    202    200            �
           2606    41150     skillrating skillrating_skill_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillrating
    ADD CONSTRAINT skillrating_skill_fk FOREIGN KEY (skill_id) REFERENCES public.skill(id);
 J   ALTER TABLE ONLY public.skillrating DROP CONSTRAINT skillrating_skill_fk;
       public          postgres    false    2795    201    202                       2606    41174 !   skillresult skillresult_player_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillresult
    ADD CONSTRAINT skillresult_player_fk FOREIGN KEY (player_id) REFERENCES public.player(id);
 K   ALTER TABLE ONLY public.skillresult DROP CONSTRAINT skillresult_player_fk;
       public          postgres    false    203    2791    200                       2606    41169     skillresult skillresult_skill_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillresult
    ADD CONSTRAINT skillresult_skill_fk FOREIGN KEY (skill_id) REFERENCES public.skill(id);
 J   ALTER TABLE ONLY public.skillresult DROP CONSTRAINT skillresult_skill_fk;
       public          postgres    false    201    203    2795                       2606    41218 7   skilltournamentranking skilltournamentranking_player_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skilltournamentranking
    ADD CONSTRAINT skilltournamentranking_player_fk FOREIGN KEY (player_id) REFERENCES public.player(id);
 a   ALTER TABLE ONLY public.skilltournamentranking DROP CONSTRAINT skilltournamentranking_player_fk;
       public          postgres    false    205    2791    200                       2606    41213 6   skilltournamentranking skilltournamentranking_skill_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skilltournamentranking
    ADD CONSTRAINT skilltournamentranking_skill_fk FOREIGN KEY (skill_id) REFERENCES public.skill(id);
 `   ALTER TABLE ONLY public.skilltournamentranking DROP CONSTRAINT skilltournamentranking_skill_fk;
       public          postgres    false    205    201    2795            �
           2606    41111    team team_tournament_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_tournament_fk FOREIGN KEY (tournament_id) REFERENCES public.tournament(id);
 A   ALTER TABLE ONLY public.team DROP CONSTRAINT team_tournament_fk;
       public          postgres    false    198    2787    199            �   �  x���Mn�0���)|��H����� ��
�����bn?��iո�/���#�T��4�vN͟�1���6��KNI���~Y�Y?t��8��
=3z��z;O��&�A��C�{�{���`�(��.P�OO��>������k��1�$���))\�3څ0�6Ai'd*d]�S�Z3����;�-ޣ�@�)�q�QE{�ۿi�yT��q��	�3��6Ѳf)��M!rE�^����\��\�� �i4;%.mg�h�\�v��k6ج�pd �a���0KC�b]a�;M��K�얽j>
ǰt�݆{���%I���
��lDs:�<��0O�2�&��l]��*_��e�zIB̗ce�hH@;�����Ŭ�Nix���fL�(���'gwB�] e�� |��n�7F���F��A�������dP��H,�>�×n�      �      x������ � �      �   �   x����N!E���@�<�Qee�Bcbb�K7�C��߹��df9M'�ǆ��=�� @�e^�?�c����S,�EvЎd���߃$�����?�K̾8~���Ҷ"��ѕ�>�T���@�U��6KA5,M�l)�Ƒ=��_�(#��#�b)��yD5�!ŚSnd/��Spm��B3(.�h�X
z�8k�}eur�=ّ�:E@�5��X
�f�d�{Ly���.��U�B�w}��(���?�&�      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �     x����J�0��u�����C��J��
"�f��X5��Q��t��D�/<|!���}G7���{#�G"��<|�r�ʢe�J��I��\��:3k|y�O2X���89C�̴,}��K��%S(v�=\�ݙ��q�F.�L+ق:���z�(&J�9,�B�0j����~�NG5)��3��[�~�=Ӄ�o��<sS��z�;?�v�BE�+�t�
����6
)�M��(�g�t�N���Z�Q潪�Z'z>��p#�R�LV�R��#�T�H      �   A   x�3�vW0202���@d�`hjellel�gd������Z���P\�W�Y����A�R�=... C��     
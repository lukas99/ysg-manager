PGDMP         2            
    y         
   ysg-server    13.4    13.4 2               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16537 
   ysg-server    DATABASE     m   CREATE DATABASE "ysg-server" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'German_Switzerland.1252';
    DROP DATABASE "ysg-server";
                postgres    false            �            1259    16538    flyway_schema_history    TABLE     �  CREATE TABLE public.flyway_schema_history (
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
       public         heap    postgres    false            �            1259    16545    hibernate_sequence    SEQUENCE     {   CREATE SEQUENCE public.hibernate_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.hibernate_sequence;
       public          postgres    false            �            1259    16547    player    TABLE     `  CREATE TABLE public.player (
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
       public         heap    postgres    false            �            1259    16553    skill    TABLE     �  CREATE TABLE public.skill (
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
       public         heap    postgres    false            �            1259    16559    skillranking    TABLE     V  CREATE TABLE public.skillranking (
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
       public         heap    postgres    false            �            1259    16565    skillrating    TABLE     <  CREATE TABLE public.skillrating (
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
       public         heap    postgres    false            �            1259    16571    skillresult    TABLE     t  CREATE TABLE public.skillresult (
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
       public         heap    postgres    false            �            1259    16578    skilltournamentranking    TABLE     `  CREATE TABLE public.skilltournamentranking (
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
       public         heap    postgres    false            �            1259    16584    team    TABLE     "  CREATE TABLE public.team (
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
       public         heap    postgres    false            �            1259    16590 
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
       public         heap    postgres    false            �          0    16538    flyway_schema_history 
   TABLE DATA           �   COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
    public          postgres    false    200   G       �          0    16547    player 
   TABLE DATA           �   COPY public.player (id, team_id, first_name, last_name, shirt_number, "position", created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    202   �H       �          0    16553    skill 
   TABLE DATA           �   COPY public.skill (id, tournament_id, type_for_players, type_for_goaltenders, tournament_ranking_player_position, name, number, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    203   �P       �          0    16559    skillranking 
   TABLE DATA           {   COPY public.skillranking (id, skill_id, player_id, rank, sequence, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    204   �Q       �          0    16565    skillrating 
   TABLE DATA           q   COPY public.skillrating (id, skill_id, player_id, score, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    205   �r       �          0    16571    skillresult 
   TABLE DATA           �   COPY public.skillresult (id, skill_id, player_id, "time", failures, points, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    206   �       �          0    16578    skilltournamentranking 
   TABLE DATA           �   COPY public.skilltournamentranking (id, skill_id, player_id, rank, sequence, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    207   ��       �          0    16584    team 
   TABLE DATA           i   COPY public.team (id, tournament_id, name, logo, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    208   �                  0    16590 
   tournament 
   TABLE DATA           l   COPY public.tournament (id, name, date_description, created, created_by, modified, modified_by) FROM stdin;
    public          postgres    false    209   f�                  0    0    hibernate_sequence    SEQUENCE SET     C   SELECT pg_catalog.setval('public.hibernate_sequence', 1903, true);
          public          postgres    false    201            N           2606    16597 .   flyway_schema_history flyway_schema_history_pk 
   CONSTRAINT     x   ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);
 X   ALTER TABLE ONLY public.flyway_schema_history DROP CONSTRAINT flyway_schema_history_pk;
       public            postgres    false    200            Q           2606    16599    player player_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    202            U           2606    16601    skill skill_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.skill DROP CONSTRAINT skill_pkey;
       public            postgres    false    203            W           2606    16603    skillranking skillranking_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.skillranking
    ADD CONSTRAINT skillranking_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.skillranking DROP CONSTRAINT skillranking_pkey;
       public            postgres    false    204            [           2606    16605    skillrating skillrating_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.skillrating
    ADD CONSTRAINT skillrating_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.skillrating DROP CONSTRAINT skillrating_pkey;
       public            postgres    false    205            _           2606    16607    skillresult skillresult_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.skillresult
    ADD CONSTRAINT skillresult_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.skillresult DROP CONSTRAINT skillresult_pkey;
       public            postgres    false    206            c           2606    16609 2   skilltournamentranking skilltournamentranking_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.skilltournamentranking
    ADD CONSTRAINT skilltournamentranking_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.skilltournamentranking DROP CONSTRAINT skilltournamentranking_pkey;
       public            postgres    false    207            g           2606    16611    team team_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.team DROP CONSTRAINT team_pkey;
       public            postgres    false    208            i           2606    16613    tournament tournament_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT tournament_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.tournament DROP CONSTRAINT tournament_pkey;
       public            postgres    false    209            S           2606    16615 '   player unique_player_teamid_shirtnumber 
   CONSTRAINT     s   ALTER TABLE ONLY public.player
    ADD CONSTRAINT unique_player_teamid_shirtnumber UNIQUE (team_id, shirt_number);
 Q   ALTER TABLE ONLY public.player DROP CONSTRAINT unique_player_teamid_shirtnumber;
       public            postgres    false    202    202            Y           2606    16617 1   skillranking unique_skillranking_skillid_playerid 
   CONSTRAINT     {   ALTER TABLE ONLY public.skillranking
    ADD CONSTRAINT unique_skillranking_skillid_playerid UNIQUE (skill_id, player_id);
 [   ALTER TABLE ONLY public.skillranking DROP CONSTRAINT unique_skillranking_skillid_playerid;
       public            postgres    false    204    204            ]           2606    16619 /   skillrating unique_skillrating_skillid_playerid 
   CONSTRAINT     y   ALTER TABLE ONLY public.skillrating
    ADD CONSTRAINT unique_skillrating_skillid_playerid UNIQUE (skill_id, player_id);
 Y   ALTER TABLE ONLY public.skillrating DROP CONSTRAINT unique_skillrating_skillid_playerid;
       public            postgres    false    205    205            a           2606    16621 /   skillresult unique_skillresult_skillid_playerid 
   CONSTRAINT     y   ALTER TABLE ONLY public.skillresult
    ADD CONSTRAINT unique_skillresult_skillid_playerid UNIQUE (skill_id, player_id);
 Y   ALTER TABLE ONLY public.skillresult DROP CONSTRAINT unique_skillresult_skillid_playerid;
       public            postgres    false    206    206            e           2606    16623 E   skilltournamentranking unique_skilltournamentranking_skillid_playerid 
   CONSTRAINT     �   ALTER TABLE ONLY public.skilltournamentranking
    ADD CONSTRAINT unique_skilltournamentranking_skillid_playerid UNIQUE (skill_id, player_id);
 o   ALTER TABLE ONLY public.skilltournamentranking DROP CONSTRAINT unique_skilltournamentranking_skillid_playerid;
       public            postgres    false    207    207            O           1259    16624    flyway_schema_history_s_idx    INDEX     `   CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);
 /   DROP INDEX public.flyway_schema_history_s_idx;
       public            postgres    false    200            j           2606    16625    player player_team_fk    FK CONSTRAINT     s   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_team_fk FOREIGN KEY (team_id) REFERENCES public.team(id);
 ?   ALTER TABLE ONLY public.player DROP CONSTRAINT player_team_fk;
       public          postgres    false    2919    208    202            k           2606    16630    skill skill_tournament_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_tournament_fk FOREIGN KEY (tournament_id) REFERENCES public.tournament(id);
 C   ALTER TABLE ONLY public.skill DROP CONSTRAINT skill_tournament_fk;
       public          postgres    false    2921    203    209            l           2606    16635 #   skillranking skillranking_player_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillranking
    ADD CONSTRAINT skillranking_player_fk FOREIGN KEY (player_id) REFERENCES public.player(id);
 M   ALTER TABLE ONLY public.skillranking DROP CONSTRAINT skillranking_player_fk;
       public          postgres    false    2897    204    202            m           2606    16640 "   skillranking skillranking_skill_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillranking
    ADD CONSTRAINT skillranking_skill_fk FOREIGN KEY (skill_id) REFERENCES public.skill(id);
 L   ALTER TABLE ONLY public.skillranking DROP CONSTRAINT skillranking_skill_fk;
       public          postgres    false    204    203    2901            n           2606    16645 !   skillrating skillrating_player_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillrating
    ADD CONSTRAINT skillrating_player_fk FOREIGN KEY (player_id) REFERENCES public.player(id);
 K   ALTER TABLE ONLY public.skillrating DROP CONSTRAINT skillrating_player_fk;
       public          postgres    false    205    2897    202            o           2606    16650     skillrating skillrating_skill_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillrating
    ADD CONSTRAINT skillrating_skill_fk FOREIGN KEY (skill_id) REFERENCES public.skill(id);
 J   ALTER TABLE ONLY public.skillrating DROP CONSTRAINT skillrating_skill_fk;
       public          postgres    false    2901    203    205            p           2606    16655 !   skillresult skillresult_player_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillresult
    ADD CONSTRAINT skillresult_player_fk FOREIGN KEY (player_id) REFERENCES public.player(id);
 K   ALTER TABLE ONLY public.skillresult DROP CONSTRAINT skillresult_player_fk;
       public          postgres    false    2897    206    202            q           2606    16660     skillresult skillresult_skill_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skillresult
    ADD CONSTRAINT skillresult_skill_fk FOREIGN KEY (skill_id) REFERENCES public.skill(id);
 J   ALTER TABLE ONLY public.skillresult DROP CONSTRAINT skillresult_skill_fk;
       public          postgres    false    2901    203    206            r           2606    16665 7   skilltournamentranking skilltournamentranking_player_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skilltournamentranking
    ADD CONSTRAINT skilltournamentranking_player_fk FOREIGN KEY (player_id) REFERENCES public.player(id);
 a   ALTER TABLE ONLY public.skilltournamentranking DROP CONSTRAINT skilltournamentranking_player_fk;
       public          postgres    false    207    202    2897            s           2606    16670 6   skilltournamentranking skilltournamentranking_skill_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.skilltournamentranking
    ADD CONSTRAINT skilltournamentranking_skill_fk FOREIGN KEY (skill_id) REFERENCES public.skill(id);
 `   ALTER TABLE ONLY public.skilltournamentranking DROP CONSTRAINT skilltournamentranking_skill_fk;
       public          postgres    false    207    203    2901            t           2606    16675    team team_tournament_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_tournament_fk FOREIGN KEY (tournament_id) REFERENCES public.tournament(id);
 A   ALTER TABLE ONLY public.team DROP CONSTRAINT team_tournament_fk;
       public          postgres    false    208    2921    209            �   �  x���Mn�0���)|��H����� ��
�����bn?��iո�/���#�T��4�vN͟�1���6��KNI���~Y�Y?t��8��
=3z��z;O��&�A��C�{�{���`�(��.P�OO��>������k��1�$���))\�3څ0�6Ai'd*d]�S�Z3����;�-ޣ�@�)�q�QE{�ۿi�yT��q��	�3��6Ѳf)��M!rE�^����\��\�� �i4;%.mg�h�\�v��k6ج�pd �a���0KC�b]a�;M��K�얽j>
ǰt�݆{���%I���
��lDs:�<��0O�2�&��l]��*_��e�zIB̗ce�hH@;�����Ŭ�Nix���fL�(���'gwB�] e�� |��n�7F���F��A�������dP��H,�>�×n�      �     x���Ɏ�E�ϝO�P�}��X$@ ���5�-#��x}2�~����=����2#��4o�v��x���?���O_��cN_��e�_�t/��r���Gx����_}�����Ǉ���gH%��J>i�53��Z�����/~�?(ߓ��Q����6(gja�J��V����b�i�_���u�Q�xr ��\��M*!*�<��Ag蟤���J��L�
u����Y�A%󡀵��9d�E��\��Z)']��a&���V���� ���2�DX+�򺈿��1)[(*�\���j�'����<���a���!F�R��T�f`u�R�!o�f`��_��R�-*)�JE���2N@�����eR9�i��B�O���#���@�f��$k��BVװ*�Z�L� �u��	�Z��7�tmV�)�R�/4�E-��UXO+��BG���k��A���T��)n���X�3xZ�<6�B�lBr���ӊz��&Z%\B�yZ�y3PEUV��9uX+jr���t��J��ӊ���fȍ]#��9��:x����V��������B�6H�V�C4����}�"AP+��#4u:��ƹ���vܡ;�V$��*R��n��0�h��L5w���j,�:V�?.&\�h�.�G��5���>W+=oX��,dk�8�V��0h�ll�ɓJ�'@�ӱڵ������զ&�s����������Z�]Ι�κ��	��-��ّ�`݃Pn�j�K@�Mu�)��2��}��m!�$�q� � ��:Ց�Z�rǷ�fi+�Q�Vt��i�f虊O+�ZF���覇�{�VF�H(��m�u��jE��3�i������2��M(��=g��V�S7	U�fiϝv�Z�<�z͎*g�Vf�Hx��(w�2���!^Z��\$���o�"Gj��L&����#�j��Ld>}�����[s=��o?��}��ᯇG��A���tS� k��(O�yy��J*��@��ʼ<	�z�!�鋵2�-նYl��^bh�
xO+s���m���A�Z���,4��N���yZ��`Lt+���	O++^$�-w۠�A%��͸3{�N�}J��VV��	m��u$�:bs����Mr@�5�N \��z}���������j	թamO|�??G+�r	�âN�\��� P���t�"��ʺ��aMO���]��� P��<���Λ���â]]��ҁ��4!����UZ�4�G:�6IT�{Z�B�5m��G�V�Dv:~�f
k�6�޴��J\�TH�T�5�E��U�� �Ӯ�g�� �VAs���O�B$(=���I$Tէ]��F&�JJ�?��|�'�}��U�e8_k
��
t�J:� m|Z���^O���G�.;�
qO���|�Ѣ��P��'U��4u-����䒫���!����3����UR�$�I�{t*\����$�x::kM���UR�$�x68��r�T1}c@=ұ5�H��p�
'����h�mQ\��N"��g��uX���Ih�i�WXԝ���T�~Ξ<�u�bu:?}��9Z��M���/hqkT!t�J˛��X���>G��rf%o��C:��UR�$�E��"u�j���9��aEe��UR?��m]&9yX��qH�B�^ŸZ�B[v���\���Y%xu�Q
�H%�cY_�d�jxZ%�@���I�,����*�r�Iɮ�(���J:�̼�AI�,jTu�􌽶{��p���*�m������
�G���J뛆.kt��f�TzZ%�CB!���sgIP��yH�c�A{�nZ]���GB�'�����i�S�c��6������U*�=�$��\���ƯVr��VI������Hr���UR>$v�E=s�J*�T�:u+�['O���J�]�����u�b;�q^�CN��zZ���Hy��^a&��J:^ԑu��sO+j��Q�3/y�CX�wy��ka��1���o���^�~����w����-x�oo��qL!��=���φ�i����t'��h�s��9=W۵�J��U�43��>�� "� �;h�      �   �   x����N!E���@�<�Qee�Bcbb�K7�C��߹��df9M'�ǆ��=�� @�e^�?�c����S,�EvЎd���߃$�����?�K̾8~���Ҷ"��ѕ�>�T���@�U��6KA5,M�l)�Ƒ=��_�(#��#�b)��yD5�!ŚSnd/��Spm��B3(.�h�X
z�8k�}eur�=ّ�:E@�5��X
�f�d�{Ly���.��U�B�w}��(���?�&�      �      x��]M�,=n\����F���[/��7��ERϏU�Znt�����@e��$F�*��W�_���>������ߊ�kп��=���_��_�������B��:}U�;�^&D����m̯���w� �
F�K��w� &
�Ɨ�����5����G���`�����k�jоx������`]����`�m������g�V��O������\�oάm�_iׯ����mC���k��Ln,[�z��n83���ny\I�����.<���HZ$b�����ׯ�����_�ĳ �<o_��q�k!ԉG���u�c<x�}!5�~��α�[��t?v��b�Q���~V�l�u��Z�s�XcS�:~�I����z\��x?����b:V��iG ��|�G�_���dE�f��~@G	x�%�J���k<w���L\b��lԀg.��u�����>Z������QZ�x��b��Z-�8_��� ���c7�^[�t!_+ʴ�/v�ܬ�_裊^��3�XK�5���1pt��5t-U��5�����{�{��Q�Jj^��ʌ���i��z�ˌ�b���}��[���h���z��\c.,��|?��l��k�c�~��M����5&��l���.W[�<���[�)�w�]�]���?��Ю}�r摌���|)�=�����0(L�v=�rܑ��^!��'z�������6�y+��G����+(xE�1o|�P3��GxuAay�v�b���^�/|�8��֊qE���<�fL�����Z�7�c<�F���.#^�2��e<����O��G�_���r�"�~g������)\����X��V��|?���=�KFQ�n�|B[O;��-�0��5�S�_�y�[��/��=Ʈ��5��=��LI��h��b����%n�s0s
���8񉟃�G,W]N��G�	1v����8q	�� 	�a.��nz���F"�H����_�z������˛;����k<��5E2�u�����'A�F'>[܏�<���<z�
��׵������N8?V<��53H���pfn+I��|?\���X�v��r��Wx��$�"��#�y�_r���@����7����89;�,p6�����f{�`a��_��H�J{��~��u��%3�<�<+1�ؿ_z(^���{�(0���c4�Э���_��[7g��;F�(��d��"��{��,m�E��;~SS3PS�I3](kj�I����D,������A+PT�ɳ�������q����n�d��w�v�\����	��7�!�`��E����'b��Y4��k-��&��f��lf��f�"�Љ4��j-��f�Vӂ�8��+M�%\��g������$�&�4~i.-��f�3T3�:��������k�'� L���1y��K{R��AFpg�4�&NΘ*tm��3�ę�3{N����D`�i4�.'"��s�3��&��K�Ts���6W�S�������!@���IペhPVgMnǡ�J��~�7C��3Oмc���8�8CƱ9����T!q�kz���3�/�&�\���<����~�pBj��TS��*�Ic_�����J���̐�ijݸ�,�݀�aL��=�W��F(��m*�f� �SZ3���N�ݒ)Y|�c����7���l����c�j0

n��I�?��q�Pp�R\��8�N�͐ k�A%8 ����V]I�y�<�	6`	\�tW���8������3nS���{3��W"��//����4��"�q��qm�LO�<���
�,O)�T[E8UF!U֚#m��۝�^Sy���XN�QH��fv�
�T_E8UF!U֚G��UWp�U�"�����~�p��
��n���TbEy?V8�5����
��b�B.��ǀ'D��Y�i���
�C\�����@	a���dͳ�Ċ
��<�{Dnh�������%�Fg��,C������9��"+�Yn
Y�6|�X����9 �"�4��4o×+*�j���
ϼc�זY'+�)s
)��w�@cu羱�,�XΗSȗ�ᾱ�'Y]�o�**UYN�SH��a���Tdu���J�G�x
3�4�Xom��H��`���摸��S���n���ˠG�7x���RuaF�j|Z��V�N���[�j�k`(�����5�l 6�Ms�銷�+��i>��i������n� P��#�
f�O#�����od~�X�<�
��b�E.O#� P` ��():����{���͙��(�	��/Tۗ����-�W,{��W��&
�M�|�X�i������cm~ri�R$
�H�|5����=�S���pe�ʦƞ�Y�.��]�c��-��.l�P��ؗQ�}Wp�:�@�G�ZX��������
nO�}�q�!��;����>��W���cmHsuu�h=8�g�����rQ��j��~Ա%�`�b��\,�.�P��c6 ���wm�)��3:��lO�3��i�x��g�
�bqyЖ71�X�3^�yF��C�ek�֚�O�
�Wx;%U���?��^��\�H���BY]|�X��\�H�p�B�Z|�����
��� D��s�P-]�D$\XG���?��X��\�x��K�������1�Ў���ԃ�ԣ?��@�xg�!
	�G(�Gz�Մ2?��*
�������� �R��Ώ�ȅ�ȥo��Ԓ���
qgh#&v8��`�e/�(��B��pJ�I�+r((r�s��%^%aso ���#^Z�nX�HXMCANӝ��T$�"^��|P#�"Q�"u'u�� �Y�
刄Y{
�}�Į�@�x��A�q��Aq�A1����t��d�3VMQPMug�M�W���xIR���g�|%J""l0��gU^fR�+4sʥD�k )�@�?�sI�DWh��q3-чǌOi.1r�����HeD���8Z�^�?���
m'Hs�$�T
�ݩ�t�Wp�٭@LD�W-V-N5{�h6����fWW}���p9+�r־�fR�+8�$� R�+���BRI��F
���]��7�pX(F�����Q��gC[��8,:� :�`T4�C�ZQ4%����k�k]	�a\P�nЬoYq�L��J@�a��(���p/X�8s7h��l���9,�� ��.�S�����B�H��H�seo�0w7���G:�������P�:itc,�� ���\A�3J^��3h�7m�wg�k�>y��y�y}�?�'�������O��'�
�熧)'cAA]�np�-����64q	,�� ��T��M ��3��Ĝ�%u$u�<k��2�$^��,�கg�Gd,���lp�!]�G���?^plcKH�x�C�1��q��u6OS�%�7��2��.��k����b\�ʡp��?�P���+�y5�<3��d���
Η;�˸b���/��_��1��p��t1?#�+8���suW�����y�G��+8����ŝ�x�@^�c��<�6�2�
$
$míF������u�㏛�� q� ��|B���L[vg>�²D[�X��-�Şz�#��]�O0R�1� q� ��|b uc���x��u?��3�P�[��e�5C4C��dQ���
���2ƒ!��Q�1j./����\�8͐��/F'��-�""��oɘ	\�E>D>�t�\�뷸�0�C(fy+��������rwz�LO{���+83=\�.�)�Q��j��+8_��%��%1�8�F���~e�ߺ�3�X�-�o1�oq�o�깙�[Wp�Ny�~����lT��<@�u��1�� �o1��q�����7�ߺ�3�XK�\��X�A�'%���������ӕH��X!�A!��$���\Wp>]L��b��⠷�S�5~��[��L�Lzh��I�-��#������QSyc������ �@�1p��R]���[��#�m�9������k�8h��f?� �#��ʞ1v~k@�c�pd]�	.�0 m��f8�f�    �C:�1��p���M�T��+D�`�c���p^DS�@|t���T1��p��'G�Ɓ��pn�pB�n����H&n�v�ۢ��G��3�3Ù��<��je(=b����s��9U�X�A26[�8Wh�s�lkBU3��p����fM�2����흮c+�:�K����d:� ���3N��ci�N�Up�	=/��BӤ|2�W`���P<���N��/��k��i�4홾�ֶ9 \��X��T<�L�<�@�д�X�@�B32����	&�䉶�=xJ~.�������k�SB�t�Z#pꥂ4)��Wy����0�%����jo��QŔ��K[0����
�Z �k��`�dj�#�ˀ�.�1����~y��,�x��/�+�%T���/O۫Ԍ\�.5�����/L�I��]r�|޾D0''�����:%�C���MM<Nռ{�`�K�}���н�
���h_�5yA��=��1P��T��j��ht/�-I���E��P2�d&���%I�`jIZ|{�+!����1�XN�e�L��jV�·��kfx�LI����q�0j��^���i+��1��� 	L�lý����%����L-I��f󘼆5�r��-�iK��$��ܠ̝�B�Z��������q��@z���(�7�TX����������s�S6�g�`�JK5������3�����`�JzZ�wl}���7p�m؎�I�V���j7<tr�`�Fm3��,:^fy�c�2�^�[�E^��-W��Q����F����S Az��Sm)��KZ3<mm�����	čvH�`� I%�ː�eh��b���\�,�VY��۹�x*��aI8k��YCg��PA�]���`�S#�mCn^1 Ku�g^��8���}��N�Jy@�����f����Îs68�I�Hю
i��+<��ŀ`�F_3���q|7x�YT�$8LH0�"�[��\t-?MH0"���a�������?]�1Ə��F�Ƞ	�$���y����~2h��	D��@�
�3VםSh���Ih�7=�J1D�	>�U¡��ӏShW�	;dЄ�<Ba"_:���hW�;֍�9�o	��YR� �
��i4�T��J;�k�h��_0[%����W���
���P$���@WiCt�Tz�ݠ�E��}�!�r�ڂ�Xw���.��aM;+�h>��*i�{��+����ǊG�Dd�����cEcEӽ�qP�n��J�i��t�{S������tp��ܑ�ӻ��Ə��hrB��� �ŏmW��QQ�@r�f:��g4�����B�Ĉ�����Q�:~�pƣ5�m9v�������2Wk/�&<���@P�.��>Y�[w�ʖ��B�fp�;?��z7�o�c3�Ӣ�cDһ��f_U���OZR�_�6�a�мE��������nl��:���l~zby���)�w����	u����~Nk����k��Xp�D�O;cP�v����i$
jY�g|�� �9����?�L�+=SP���w�M>��o��R)�iH����	���yZ�'�.������*$p�^pa^x���4D���U�#��>fGo��c`+�� �����Vw�^?q/;h>񈧟x/ꠍ�k������>L2"�r0��={�"����)b�{%����d�e[\��u�!Cm:%[.}�PR��s�R����ȇ7��Ò4������������q<<��+���0^G��}A�cl,3�/��0�f���A�}y9�������OOr�]�僒�W��_l�.5�����ܮ!������;��.�(@��ԍ7<r�k��?�u�.嵽)��#��!#�h���+p�9j�[^z������e�ŏD��T ��~5.K&���!奿���2�&��
��Z㶛��Ѫɨ�����̓�~?�1�7�	#�0 ˋ䋳e�'��%p�g��t����E�:��j���W0�Z��h~����<���q��v�z��jR�.�җ����U!�d�P!Q^��a�Xpډ����ᴊ�^�U�p8�JP6�ͪXC���P.���Ou�58{�dYPuf�~��o�㮇��Ug��g?v_�,F)�|ߙ��w0!Rв�mέ�e+�M~܇g�Ms�0��_�
Q��,1�y\�j�pQma�V�Z�$ώf�w8�Jۡ���F�.!�~7�~�uI���z��%��8�TQ=A�M�>��y��� �E�≿�z�2��xN=Y?���,rx�3S��N.�� k�_ަu@:A���*䑵���&�ǣ�0�MV�� c�EYN1C��E���� ��V�������.R�e+�t��kz��'�2�8�GT�� 9j,|�^����C���a���, h[��B���%��'�����i�{zZ�.(Z�kH�M/�S�(�G�7��B����ZJ-���m��� ��2.�S��KP�~��'u67�6�ٖx�b`�(8������;��	*�Q���>[h:2RU��H��k�� P�<F2�W,���;3�
�7�<�o�ĺ�c��4�u-�c�v�Q]�[e��7`.���p��5*1���D�Z`�@f��F�Z���}�!�v��!���(-k=ߎK���}��\�B�����$�Ѳ�_�+���Be&��~ F��<����v]�`,z�3E��;�� �pN�{yG���������$��F�O\0}4y���0���W7bwh�d����_ѰG4s
%�ǹ��͜b�8��|�܈3��������S	���*7�� ��a�LF�W8s	�OV89_��#���8��܇7���(í$�up>M�I��"���.�+�݊౱8R��x��{̌�*������q����e��G��4K����f����U��6����%ËJ���5��W�
�q<�E�F3M��%���\��t��*�/��oh�r��%�k��a�5�
#�+���(i!�%�������
�+�9F�w����%���֟���P��;����������/����.��15zf[�z!�Kf�<_E;r�X�q����>k<>�����^3�S�����sc\�"�yTVY��(�+�xn}�u�9��F�@R�A�"߱���A����\$�</����R_����q��2Њ}��,�k���pЖ_�ٞ-����K8��8��!e�;�/X�?m�i��B���f���*��BCS��6g�uR0lt/`�V�z`�"VS5�������u5��T݀׻;'e�h,����`YF��f�99K�}�q�M�|Q�l���+�Y��,��1�"d=%ɂ��c,�օ1���]B�=��bfM��/�v�4��"S�@H����b�l[v��K��x�����W<�Ꮫm�.���-y����p���O��2���|��v��Q�/�_P,o��ͱ��z��Yv�d���Z�6��(������k�/��A������w<�f2Gv��+𴻿$�ǸX�ΧZ��lF���T���?P��;�'��%�|�g�<=�$��j���̘���%�q��	=�;ʳO/x���ƒ=��ٲx�J\Uѿ��"C�ՎL������g�!;:g��o���2��w@���ؿ����0�=������7�cׂfO|�9B�l~�����E~��kB]st���mP���I�9+�=v��P��g�L�,��P���u�Vp����}�4�Bg�|	*��p^ ;�H�~��jx�^����+��0���$X��y,(>�I�B��ٕa�G=�ָ�s�˰�*0�������t��^��O���A��7��ʙK<Ocv�������hn��+��0�羱}-{pQ���1�Z��w���/7��y/�|��$�%yWx�BY�
t�A�n�c3{�P�q���QJѲ�2��x���Tu���o����"mVS���h��x�f5��B�M�����Y�T�����U�Y�	hn-6��G����\�5�U�+�{�GI��7xN��?Z�I�� �   �9y�Z��G���qzȖ��'9���X�\���a��-�.6�O���r���CF@gr��)�]A����ѫ�fhg=PZ�\Ls{>���m/�����Z��C+�N;i�p�g^@5=}C�Z��1_��6?��s?���d�~�Z=h�� -',��-��Z=�s��+kP�w���������cYR7      �      x���M�-����yW�������Q7
h�6��>$��$uj��_�IQ�r����O���Y�֟^{�Kk�������o����������Ͽ������?����Q������3�0Ј@����(�4Ԟ�����K}_kZ:?��D����2-@��t���6�x�'ʴ {�7�S�R�X������v9���U��'Ղ3�3��s����8N�g���y�[�	����q�(�y8N��QNu=[l��HR%�2z�,��>1�k�9�~��S�b9��3�e�<~|㷮��a8�����7㷽�yǉ��t�����H�n��-z���OIL$E#��m�w�2�,�IA�8Ђ��~*�eZp4����{��X�Ɓ5�w3%��z�L�Ƃ5#Ϊ�q�'ӂ��`q���N�t���Y��	a����2-@V�h��Q$iP�X��|��=e�T�˴�h0X������3��i��p���
�c��0��/��-�ՙ�8��g%�N��_��E��A�G���C�>E��	������W���(�{�L�~=m9���A��L�~>_��DG��J�R-@�@A@��.O��v��H��?]��G���TDȴ YJA� c|���z3-@����f�����x]��w�'1~�h��Z��=��`�Pb0N�I?s[REH�0�Y�yb-@�@~��q�e1_k&�¤�j{�<��UI��ݳ��֢紨�b����2ziDC�|W�aP�M@~Y*���z�lA���h�_�K7�s�-������'�~�]�w��V��9�� x^��9e���DA��v^����tH/�� 8ΨA���9�OE�2F+����o��z1ޥ.2��Z�,�!����T%��o��钍ڡ����c�q���[�q�{P�h��v�����{[�C;��k��%�}���E�Ɲ�[5�_x+�7�KA�v�)��z�L�ƜSC�)�.Zp��|����m�I4�.�ϚڎW��[��8�ͧ�k\�m�:�R_N�G���5���-~:�RP,���)�ȷk��8�-�VB�=�]��h,x�5�ٞ�r� �~�Ro�^	��W����G��-�V
s��dZp��v�Տ��Et^.Zp��W�-V�\�I���lo1����F��-8�vs`��$�-8�v�E�ߺQ�R?[�Gs�r���d�Ä�����<^�����gR��i��o'�X�L�˗KA�/'�ӯD��(ȴ�h�~�H�r�-ӂ�>Ъ�7x�Z��~�T�m7W?��S���T�Y�-z�`<{y� �j�.��x �O�T6M� �´z�K5^���ڨ;z�%Z-@6��d��k+w	Z��Ѻh?�RP��OTc	[T�K� ��F��kwK���2-@��6��cT1D��������^�R�����fZ����.6���(�e�d^�v���A�)0�sn[mQ�l�+�d}��������r�R`̵G� �T2���X�����6e}��4�d�h�9\�w����:��F���|;�<I� �74��T5���$(�d��F ��x.rg�Ϯ�u�-V6]���hE.�l�a�02�8�e]���f1��Z�X�-^~o��h��o�Q��,oHP�ȢB�v�`����h�iҨ0Gh�U�(�N��hPX~�m{�!����1a��)le˅s�L��owVDm�TgB\&�*��/�a;W�����Z��Z^7^?r�na�C����_w-Wg�:Ղ�����-
���牵�p�n�_������ɴ����El���ļ�E��6X��?�5�[�96��i��D����)���L��u_gLj��G�ڝ%V۹� f�/Zp4/���j�Z!vPs)(�܍Z3���2-8���	ӗ$��y[��lۧ�~U۶�Kl6^���W�N�mP*Q�[��l�I�A4X�ҟ�1���A2]�TK���:��5�S�j�&��z?��#����d��a�N��L�F�'�
G�t)(^=S�N��R-8� '������h��h���Ȗ5WR%���."��ƚlp�P�Ƃ��p��fr'��/Zplc��R��4��vH�Gc���2_�߂��L
�F�ǯwa�w��v}�G#~S/#�5�L�Q�X�E?#��)u��k?�۷t�||��Et*���967X��#�to��J��8S�7�b�H�D���f���i�Ƴ����/Z�l��y�ǌe��DR`l����P[�%��E��VU���x��`F!S-@6M\�&�#IҠP�MW/qøiۓ(D.Z�l��zYH��@�w�-@6M�n���&+.�O��C�ҷZ�Qqn��E���f�.$(�
��'�:hp�
�"C��uf}� ��/Z��������Ս
b�r�d8O�^�$_�Rop�`|���2����WЙ�[֤�Q��z�	���T���O�i���x�xSG�/Zi�p���ڢ&�S��4S�!hȸ��V@�)�Wי1V��q�T+ ��[���cT�ȴ��p�d~�k'�0s)0v�ӝ�T۵K�F�S��,.x���V�u�,	Sm�Zi\x���a�6�'J�R�~���##!�2X�T0���2�l3��K�Y�~�-;�-�h����3�M�,�}q�
H���W�M�E�D�V@�����Sc�ʭ�V@|�a<3^e7�\� �i��%m�ب�1�
H��;�k�XWQ��R���v�uz�h�ӋV@�[w~���,b���z���?�� ��^� =��p{r�N����VH���ޠ�Y#�5��˴B�����L��"�B�kAz����[ڮ"��/Z!�3��$S\�GdZ!Y`��
+.eZ!!�w�r���z� io�༪Z�a�|_�B�JrOک5~��UB�VHSIA^z��ߨ�X��RP��Y0V�4�E+ u���l6mb\��4Y��x�u5���i�V@���|�����C��4|w��)WI�V&uNZ~�M������m�k�V��b�X+ ���� ��D�K�V@Xݍ=3�s�TVʴ����Sc9Fu�R�����w!������E+�ftw��
�ZW�eZ�׹Hf�"˰��P+ u�ǛŰ�o��ޙV@��~:���C��:����K�h�bՕ�����+�eZ�3�����-��
Hߑ{����Y^��b��,2M =��\�y�
�.B�N�7��2�T���w�uҪZ���H�VH�;�g��@\��K�c��
�N'�7qB�ҷ��t�w�|p=�L+����V����%'�\�B2p��S�����L+$�ġ%+Gٮ�H�VH����tӁ�Ź^�ґ2r�Hogfur���ZGkY=�]��8�
h�"���`�ҩ{O.Z!m%{}2���%R�j��c� Ѿ2�3��l����`��J_ip��L+�]5G��WF�;�2���"�{�C��K�����Hk���/�
�NeO$ֻT�$��R�L��ҨݾT+ ��AFh���@M���F���o��4��]�q����V@:g�o1>�Ն��t�.��9˦���V@ߣY͍�b}
�D�T8��5�b�./�NK�B�^�g���~2�z_�B���g
��➸���&�Lѵ+T�cm��46�Y�(q��E+ �#ݿ�p��9��zK�VHVG��sԺr�j�d+�{0 =奦�R��l���]�%�Q�P���aܿda�O�\�ȴB�*��Sj-��L��I�cC��a����T͚j�dS�=�l�n�v�kA��1��s��(���R��t�9�6�L��W��x��E��|�M�^�Z!}#�_z�@��R��,B4���au��;�/Z!i^o;����Og^S��&v��^�c���g�jd���0cT�UM�Z����K0�ߝ�Zi�����,�ڂI��w4����[-'���jd�����Ծ�!Ρ\� ��w���!-�E��Z}��cÜ2{���jS���6����(�8�t�
�j��[k�0��T+$���YX�B�$۴�C,I��*�S����9-w3��/���V@�2���mI��U���ċ�m��� =  F+ ���?f,�/�@T`ʹ ـ�{e�9*N��X+ ����0�������z]0%��T�&�J��������_�n���*4ܹ����eQ��T+ �v���z]7�Z����y��듸梕�j�����X�i�=�*2�
�:x3�d�����S���?��Oiʭ2�r���?$�JAN�ie�!2��;�h˽�E�e�J�K�B2�X�$�X�ҩNT��_Ϯ�r/���� 5ۅD+�y�ճM�w�[�d[��V@�~�ƨpWgZi?`���b�j�&�J��f *Z׿��f�_��������WFf����������M      �      x��}K�e9�ܸ�
o���R����G6p����ze�)&�5���'�")~�e������&��_�-�_r������~��������<�����?�������?��?�����?��`S^�T��P������)Ϭ��Ƭ���J���g�jP�U�P�o���=�����yL������_���c���Ť_����f*�i���3f7��R����ϳ|�B_��*�iuTS�ϡ���=����m[�tVۢ*������SUl �TͭT�C�T�)��*l����*�kϪ�g���SϻT�<�S�Z���7U�Z���[���ۯ���ׯ��� ��5��+�g�Ф�=�{}�X�a}����g���O�`���_�o˖z{hNL<T��^���#O��Ƃ�g�lC�v
�r���My�H��a�ϊ,�Mr���o�7������M�b�����O������ɡ��b����T{�p������2�=�_C����A�CQ�=�6�ڂ3��`R��|%��5�_�Ƃ��4C�.��xCg�ÂI/�e3�}C����޹��]t�R$\l*/��ύ����U.���%�y�ע1�Ў�`R	a�q�����c],�(!~��/��_Cd��v&J�jJ���O�9yX0QF���_�7�Y��.��`��05s��xz�h�.L�ͼ��ƈ��b�D�cB�S��ˏZ՟`�D�cl|��)R��Х�aSɔ?��f��z��dc���׬����i34'&��i?�-�n���aS���_�1`%�?���3�r�!�Ɂy]�`�d��ؘ��V���F؟`�VȆ�k�2� ���O�`���{����.q}(Ț�a	�h9g���� ���[�Ba�b�05\*�� [�:f�;���Ƃm�j�O���� ���"۔Ѝ��38�I<,�6wɖ��]A��]<^��T��5cn����jx��MEɒ���b��<ghOzX�Q�dȯR��a��ZJ:�%E�MS,��WhvtM��~��uџ{��`AוN.P��aP�Х�aA���N��k҉~�-/X�-�N���(C��w�U�t[���������P:�y�������;E:w�%��ݖ;<���@�[�Â[ER&gh����)w�`[���/���YFظ�#�łmsnbC[*Fh�m��Ʀ��/l[VҚ|8�/X�e���2

F��n���l�l��-y�`����b�V�K���לt�p�]�`k��8��y�&�BH<9��l�l�[Ɋ���łm�m���������!6�%bc?�,�0�<��J�X�Q�yS��X�����y�`�,�ٯ�%g���vo��aS�%U\Ж�%#�'d�x�$/�E)9L.؁;ty�X�Q��N�F������Fh�xX��$��=�j�Rcs�`�$�6��ͺo���r��y�&y��M-Ȝ~H��H0Q����d�����6J��vV�@6�PCdd"�����|�
	6
�V95CdQ;l!��Ŧ2)D >aU�b��`�����6���ar���l��]�6��N�o�[�ސ�ă��BD�j�1��Д���b�F!"N5��3]y��cq"'�ł�R�Q�g#d���(�l�$]���1��`6J�N}�p��Sw�|86�����s/X�Q�t~�~> %���;��aSY*J�O0t-r&dI�X�Q�4:��Y�`�5�2t�`SQ���7<���fDHzPPQ���B"��2}66�$���g���)���X�u�r�Y���'	-���P�e��\�&�X��]���JG3q� �m���\,�x�s�bo�Bis=@��TvV�M#�q�?��f�aAWt1y��!��������J7��Z^axb�\���s���9�HG��,�c�aA�9w4cC�Z6B��:>����z����\,����ρD�5�t!%�Â����Ҩ��-�=l��#��yR�у-$ ],����ذ��xD�_�`b|O�[(��_KT_�x�\,������5Nx/[�Ŧ��=?��Ü z~'&���s�ky�c��&���s�abB/X0i��9�QB�d?�����s�a���.���~�n��zY<�}�������s�?]�C���������~��"�v����d�b��"�3u��J�Y�90?��1{h=,�4��X�!~���	*�f��C�yæ���.TX������<w�}(�4��'���V���峱��y"�dRc��T$*�e1���s���\�Tz��9:�?�8)o�F�����s��+�����jЕ�ㅿB+nO���ÂN5h��+�C���ډtj����t:cy <g��	tj�Vϝ"C�'��\,��5q���%�"�CA�f��*��8�>At�P���M����
]���$dl��ƂN��J��p�b��/��y��N�r}	4^������XЩU^zb<`UX�IJ���H:>PX2e��b[��&�6r���aDa9#���XЩLј	k�L������ȔW�S�\Lq`��b�X�A�`�н�����TC����V6�ђ)A�'�fcSm��-���J�gyZ �[V�-l�g���,!ה�M�%l�t��Ԇ�<(��re�jgw����Q2��lŝvY̜v�I������-I�!��łm([�w$FGCdCzPpM��e�B��ʎ��R)"/tO>ky@]C�X.l*E��yO�lH�Ë���R�M���C����G��k��Jy�9Gp\�3྿`��RD�؞z�8n���`��rDz�r��u��2h|(�T���L�K�ttf6l*E��������\�,�T�H̨�Պ�d�MR��\r֎�y:�´�"���y�y���]
c������y�1�VE6�@����6�9�GS����f���d�d�J��S3:�%���Ws� �$��ځ�qY���X�5�>��2�Ap��bA�I� G5��� ]R}"'�łl�l1��Ar��(j�'X�M�1B-į���2shfdKȠ�K��y�ћf�����&Y����o�1h�383���������̺H��n�� �$c���Ҿ6H�bB\.X���0اXd8�9P���%��d0�ހ3��&�U滶�>$�9KE�v������gU$3���[.X�i���@�WQ��З��|��D�cl�h�\L:͇��:g�q��6\�I�.����8���u�t�񰩮WgG�����y�};�$ޘt��P�E,����a����nȷ;z%9D�+2�U<,�4��1����!$)��q���#Ut�ߎ	�%���`A�RE|��)�1_�թ�H�t�*��O�Xq,�~���BE�����Z	�1�`�F�����|.���Bt�&q�
���U�4�9DfBSݔ'��x�t� ���.l'b�B�4ױΧ�\�`�4��@?��9Bߡl�l&E��Sr|"�#�,�(K
;�@a}��\.l%�1����4�~��M%	r���� 58P���MRSؘ�r|1�uF�Y|(�(G�u����D0)jY��l�#��v�e���vL�x��^Jyy������A.l�$uxrk����/�$��6�G��&���^�6�3��->�����zT��v�IVX�X��^I��J#,�(I�a6�{r�9�o��i��Ǽ '(�*��$���U�Ɉp�Ď�刘�����d�M�y�łM��0�İ0v�5�����+��G���;ӊ��H��:���3�dc��\,ؖ�y�W�߽���7Υ����l�/�u��ܪh�s�llj�璧�i��an�[I��:�����M�*9\�`+�F_�&Ο�&vupn6lUW��ﲿ{^1dQD�]�Ij�M�p|^s�Х�㥋[W��,�3[c�R�́�K��)x��z����v/X��$�,�a����=85��$�,R��R��SkD&�X��$��j��u����    +�2�bS[*IZe�7�{��\�.l*IDM���}��)�߃+�a��|\I����c��xF ��J18��:��DZ=tx�$���&���'�FRY .l*ID��"L_�d��=R����j%Z�C��6�2],�T�T�*{r��nT׹`���D
������p��@̓lY2dn�(<���7�x/�Զʒ���v>o[,��\,�T�����ʹ1��tX�`����1Tu��k�X��� l��ꪺ�N&�3C�d2}�%���O���v� �$���\��*�v�p�Iz�ٖo��'��Z^2�C\l]E�^*@�"����`���BF=R�~?�һ g>dm�X�Q�T�v�߳\V1#�Ŧ�R�HPZ����u- 6m��bAF����  `�2�.�$_!��Z�$���{��&�ɅL&g'�"fX��A��KѸ��Н�u�Y1R/���<��,?�D؇�'�$�	T�b�hctV������	�\��*BF�U�bS�zM�N�b�I�tH*:�$��I���xGwz��Z^��Â��SIUq���%� � 412^ѝ���q_���%���S�`ť�)|q �[Hpm,�x�����َ�]PFtf6d<ϒ���C6���	MҢC浸��w��8#dU�X�i؛��?�Q���6	h�zѠ�����N�����BRQ�鼞u'�o���`DL_�-����d�0����"��2�SO�	�%�U�f5F��_d��` ϋd�wn<��¼�!���~7�#b<3࿺`�T��,� ���,�r�\� cV�(>Y�j{�f,ȘV0����đ�O�`AƬ��d��K� ���M'd]fvz�� '�f6d�*f���dwDWф&)/T�_8=������L�`�<h�l2�8e�q�a2�zebҐ\�|
�� R08/~��L��vg��0⳺`AF�1E~s�K���C��F�^��JJ���i<V,ȸ��ru |�@�2�Fq�<������;���&ۮi�r��CY�`A�ݸ�Pc�t�X��d܍��2���ɱ:l�k�y�O�J@:3��d��v�r_9 �� ��o�]�����@L�2�f���|�U�Z�@��d*A�l��mV��\���]�ihe�1ȴ�L�\����5�eK})7S��W؇bU2:2�2h��,�(��f�`3���H�(�tO;��XX%+��=,�(+Slm2i*ZF����C�y�����w������J���E�	��^� ���Tv!�*����MC3l%h����(�`\� �)k<e�ħ/�ܴ,�x��׼8�\�JH|x�4O�D͝�_p Xȑ��,�x�$h�!��0~32Ƨ��9�#�,?���v�����N��>ԟxw�`���T��>�Ur�&�����a���ԡO=���b�����b�����y�9��r��Ƃ����\�H_��$4╻`����mK�/I߁� lG�&˟'`Ʌp���4&#�'O۱R� K(P���MR�]f��tF� �S���ÂM%�6���1r����dj�Usn�ʤ,ض�ż��rKc�V���b�Юdk���p��9 .t�"򢋟��pIB�E�`A�)}y.�;߁�1��.6�s2�ʟ������*�XP�L]��]}�ag6�
�^�`�R�O	g�����M�Ӱ�a��E����%C����V��Pv,���xrHw�i|����/y�;��c�&26��c��'~�e����#H���[���'~���4.�#0�;"!],�4~�mV�
� &zH�s�i|�ײV�9��M>�Q��9�44z-��3y���6,��S�Ŧ��k�\�C�-G`2Yh�xX�i���Z>�__�!"�S.�44�-�%�����z	��ƂM#a_ƹO��I�� ��MCC�rf��n��.Q`߈��J���������5v���Al�I?����ڭ,t<,�>�$˞���� *mtn66Mc�r�~�, q�2��E3J���M���`�Ԙ9l|��d�J���2
(���v�Z��|�d�#�����o�t��j<,�(F�)b,�G���u���Rdjj�{<h�/g�a�d-TYƳb75�k1D��e�ﴐ��Ŧ�1_���}͌E@���Â��q�r��v��&{J  ������5��/�b�
�`���)� >n��=@O��/�45�l6K�s ��Wч���dd�I���C <ul�b�����;�"c��H*�2^g8��ĈḾ��w�f蜖.�߿� �@������,�E<e#p���	�(.X�Qzl���8�lф&����W��������)�|!,�x�7�~NU9 �����d<�[�~v��"�D��$�]��]��@ԗ��CӬ<�[�$r��{�?��t��L�s�'���1�xL�d<�k�"��r �"l1��aA��}9�!j�H�Sh+:PP����?�L_��P	5\�I" �6������ 
��]�`S#�11f�#C�����`S#�m����.�RW-�v�`��F�dv��b��݆�چD����=3;���d����fS#W�-��&G��������Zx���������I�G:�<��(`2%����MR�3�Y	�!K���i�`ӳ-���1q�#Hͬ@1�lz�;]���ɪ#�P�l��M��)��#H�$�I�vr��b�烝K���PU�6I"(R��T��a�+T;����l���1_S�c�(�p���R�[�����/�4;��`R_?<(� �y��l��!��VW��[L��=,��/�J��zx����T~2J�A'�)��d,M�-�2
�A�a8��L�9q�&�)d��T��e���\� �x�H���E�L"�bꪇMR4]�^�
���ofcAF	E���"�;Y~Y$�����BXc�*}q IXY�.6Mm1:7ȡ��?$�l�`A�5�_��;Vz\,	.��CttZ�e�c���#�@>4Mm��l�\s���@	
2�-�!R�wX��aA����n��\�>�>5P4�MSc���
\�!��b�͂�Lk̿Z��K�#�
����֘�YZ�Cd|�@�:�1/�����!�^^�����Ʒ�+��E77���D?����I�����g.XЩ<a|�y�h��@��:���O��o�%��:�`��0IבD_�Mj�<[.6I�a+������j��{�n�iƵ�Ą��_�Iz[���]1������MS�7K���r�,������`c��^f�R� �1=�/X����dҌs�ma�
L^�`cc�����@`��J��6���f~�U�],�(K���:�}y��ł��D��':�Će,�T����1ZVG�u#��IJ���$	ʒ[�Z@"�#��ۖ�՟9�n�v�{C�]��ֿ~Z�n&��Йv�`ʜӲ����@ʟÌgux���=(xc��oTD������S��q�����޸<(x:g��t��aP�.\b���&ɚ�m�I�B.@��9�}�ï�tV��Ăi������P
��$�V��ޥG_p��ش^J����^  ��J��W�w/K���VB����ʇ�0�P!�L�^Qz������%���S� �Ɵiܾ|�~c��Â�Ӂ�=ڶA�X$1���ݧ[(�Ȱ�B����f`'t�ǋ�����AA�����f~A:x��|�VVs��;v��=?!��M��lRߵ�fЅ�b�ʺ+�0;�,�J��&u�́�L��4^/��OFء��l�W�ufڙs��i�M�aA��D�����o{j b��ė��^��g���K���=�.X0�����_�'cקM����IB��rO����&�HS��nJ�}����$���d�l����i&����XLШ��'X0Q���x��d�<.L԰Z~��_K��@\�&j�c�;�g��X0QÞ���e�����`����+|��7C��B&i�",��K"�j�^��VU�:[�Y,S�<,�(�)[Y� |  Zc\�I*��i�.�|�@b�&ʇ���i��4^�`�|�I6?�����d!�Bٰ=�jU}����a��ߖ�&�]�`�l�1�d��YA���`�lئߢ�@+�6ɛ�0�~M��h�`�j��Ѽ�]�Sc�T&���b����v�X0�|0e�f+�P<��M��$�gJ���|1��ÂI��2�ꫝ"2��&�+����j��M�łj(��'���ZC����V�����ʘ(w�i�W��5���;��&)�A������flV6IA\ΪY;��(��9,����2j*;��Q�\,��RYV���c�ƂJ�U��-�(��C���"�%i��Ҟ:8'���º�sI��`����֩bO(:ԃ�H%�ϳ遨IpN66�������+���bA���L�J��θ�$.AR���~�\��P����J��R����1��aA���|R�/?9Pv��J����>���8*���T_�b��ާ�r:],�TV���T�kx����&Iy#�噐�����lZS��k��u��UCƨ�MZ�m�Z;���{lzشKR�b�r^���Lp�b^��]֛peX`y�\lAL*˰���C.+���8���[~�-}(6��Wﲥ�J���b՘Z�E���_�������K=(����������_� c![�w�����e����M�^VȶU���/B��Â���k���������Z�9�󒮀!�ł���K���s�.OJ�/fcA���e�������X��\tYVS���d�r&\,��@g�\4�2/�S�a�t26�1���
�
*�L=����\��#���b�$=��W{�c �tF��&i�#d���$�㙡/�֦�_�J:���@��d��k�<��O��t���i6
�n�t�s��"�IN��񘝃Xd����;��M�G��f�d�_�!d<Ӎm��2�}�J��.dzЦ��":���.d<h�-o�4�
r�i�<iY����#F�
^���҃�R��}֪�Ўp9�$b��(F�9�H�5�b��uf<��7�RD��.O��s3[��+�=,ئ�u�GhX��x��I�@�6�Tkل|+.l��Vm5UF����v����ٓM션�w�If,\ou�ZcrE�������&+)�G66��\l��kdV�B� �.�V�,�t����U�#Hrxh%=,�t����n�����b����ݎ����p�i���u�6��w�X��m#�d͛�]Db
6=o�X�1�[(��ł�������)�d<ܫXM9@/��-.d<�sضZӰ�Pړ���ʶ1ߦxF[(0�łLh�VWM�ʦ���a��F���Ռ2��7����=i��� Rx0���b���	Ys�ik�5�b�<�
���K-槆��\,ȴ%��8���m�G ��bA�=	$���#!M/�3C�.t�f�A�*`���<l����5�7b����apv6t�m�3=��m��J8�
�8��tErQ�I�1D(��&��'�<�8��o������G�aL�<�.Ǿ���{;�+H,e����P-���f���X�5e+.[�[��B�T}�-����4��]l��ydk��1[ʁ�K�1wG�XԒm,��s���S���Pd��͍�Kj��1���
�Y�����"E�/X�-� �>�,)������a!"��"���O�����I�I
z����?���R�0@�bA�u)Y����e��@��t���#ٞ]f���<,�t�t�]F���@��R��j�bʃԳL�$�Pi�I�Z�Uo7U�D*���e�[��q�iwU�^�i��`-4��@阣h����3�bA�jWf��y�a;�l��[����]�vV9K̮%IC�[.t*Uĭf4��!ƳC��.tz^=w���C.:��X3�J!G7��{�$�ֹUh:ԫF�ggcA�B,�����1�2U],�T�dJ�N�#F�&�ش�G����a�v�b�P���G���������\,�T���Yz����O�߃��2�L��!��6����E��f�OA��Bz�$�Ʌ�%F���������`�n�.�⤫1��a�Fy2h�[*X�2�!q�a�Fq�}�OTg#��cq�I�
��Y
�c�$.6�Ia�]�-_F���u�'X�Q�ީ�����TL��`�(l�i5�D<�D��e�t��.�0=��u�`�,��)�(=�ƓCI3.l�%8��Z�/��TW�6--��m�tO	b
5���$�ԃ,}2�041
.-,�ְ�*N���!k�æ�%*���X���ŋ�`����h�(�"#HS��BzX�Q�L��&�C�}.lZ��Fb|7���{{���%*�v�0WReC��\,�(G��~�U�C�U4m-P)/c��j�ݡ��.l�"�4�ZO��<1�����ʑ�i�[��Ʀ�%*q�Ton���b\,�T��u��V��j�qY�#���V7�O�ӳnBg.X�c	��̚��I	��W�`��E�kK7�f�����}�
�H��>���pq`R�.X�ci�E��(&uـR~�
˞O�zn�Nʊ��.X�e�=_,WO�B�����+t,{>��Ko�z����:։�r�=�E��W�+t�'��QB�CH׏@��+t*U����-��0�x�`��ReU���(���Q��m���K7`�_�BG��]ݥ\Bˡ��a�N�����Ѯ<3г�:J�m���Ej�l,�
w�n�חCHǦ�V�B�;�[�Xr�����!��a�Nw&��b�;�~�d�_�B�[�:�ѿ�!
DN 6�:��q ;;�HS�й�B�a�&��ƞ}��:��2c�|���*B^�B�A���٣�C�{^[.X�S!FǯE��~�JHl��'����X�      �   R  x��ձn!��{��@"lcc�,];vJ��}mn(NN +KN�D��h�	0��3����ڃ��΅���������Z�k�&�Y��5�D6�9VK�YƊc��,c�XiIl�1��V ��Y]�o`GN협;r6�D����9��S�1��r�oSB�RS�b$�-˩űF[�Sٱ�{j�c��e;���{�Sm|ۃ���j�*8�)c��5�yO�X�A�S��W4t�ڼ��	dH`7�0�y�+��3�m�=K��Ac׈��0�G���)k<h�5[�y���G� �5����AT�m�e����Rc�t�� �ϳ� �ƚu�~�����8�?��9f      �   B  x����J�@�s���;;�7'm�
��V��	���O�D��Bn�˷����B��]��4�/��Zm�+��!?��5dm ���y<tǩ�c�緿٤05���8[kF1v��;����NQ��2�X0V��-{�n�w�ǥZwC��H���xF�瘳?����|�����ӑe�3�[�W��i���7R,�GL����j��6���D,��:#:��0�d=��~)��j�7�S� �e�Sq�s�̽H9I�@y��D
5[i��v��C�h*]3��L������2@S(�,��oku]"c          A   x�3�vW0202���@d�`hjellel�gd������Z���P\�W�Y����A�R�=... C��     
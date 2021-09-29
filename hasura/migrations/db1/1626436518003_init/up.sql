SET check_function_bodies = false;
CREATE TABLE public.db1_table_1 (
    id integer NOT NULL,
    text text NOT NULL
);
CREATE SEQUENCE public.db1_table_1_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.db1_table_1_id_seq OWNED BY public.db1_table_1.id;
CREATE TABLE public.db_1_table2 (
    id integer NOT NULL,
    text text NOT NULL,
    table_1_id integer NOT NULL
);
CREATE SEQUENCE public.db_1_table2_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.db_1_table2_id_seq OWNED BY public.db_1_table2.id;
CREATE TABLE public.test_table (
    id text NOT NULL,
    description text NOT NULL,
    another_col numeric
);
ALTER TABLE ONLY public.db1_table_1 ALTER COLUMN id SET DEFAULT nextval('public.db1_table_1_id_seq'::regclass);
ALTER TABLE ONLY public.db_1_table2 ALTER COLUMN id SET DEFAULT nextval('public.db_1_table2_id_seq'::regclass);
ALTER TABLE ONLY public.db1_table_1
    ADD CONSTRAINT db1_table_1_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.db_1_table2
    ADD CONSTRAINT db_1_table2_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.test_table
    ADD CONSTRAINT test_table_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.db_1_table2
    ADD CONSTRAINT db_1_table2_table_1_id_fkey FOREIGN KEY (table_1_id) REFERENCES public.db1_table_1(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

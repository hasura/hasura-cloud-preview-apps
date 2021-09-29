SET check_function_bodies = false;
CREATE TABLE public.db2_table_1 (
    id integer NOT NULL,
    text text NOT NULL
);
CREATE SEQUENCE public.db2_table_1_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.db2_table_1_id_seq OWNED BY public.db2_table_1.id;
CREATE TABLE public.db2_table_2 (
    id integer NOT NULL,
    text text NOT NULL,
    table1_id integer NOT NULL
);
CREATE SEQUENCE public.db2_table_2_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.db2_table_2_id_seq OWNED BY public.db2_table_2.id;
ALTER TABLE ONLY public.db2_table_1 ALTER COLUMN id SET DEFAULT nextval('public.db2_table_1_id_seq'::regclass);
ALTER TABLE ONLY public.db2_table_2 ALTER COLUMN id SET DEFAULT nextval('public.db2_table_2_id_seq'::regclass);
ALTER TABLE ONLY public.db2_table_1
    ADD CONSTRAINT db2_table_1_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.db2_table_2
    ADD CONSTRAINT db2_table_2_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.db2_table_2
    ADD CONSTRAINT db2_table_2_table1_id_fkey FOREIGN KEY (table1_id) REFERENCES public.db2_table_1(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

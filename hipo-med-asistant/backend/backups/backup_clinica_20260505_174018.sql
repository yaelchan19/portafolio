--
-- PostgreSQL database dump
--

\restrict v62cczTpTYCSuilJOxHzYeU5QNqhe1v2KKXdB7hQT6KYh6y9S8ffyVCkNGPygsq

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: estado_cita; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_cita AS ENUM (
    'Programada',
    'Registrada',
    'En Progreso',
    'Completada',
    'Cancelada',
    'Pendiente'
);


ALTER TYPE public.estado_cita OWNER TO postgres;

--
-- Name: estado_consultorio; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_consultorio AS ENUM (
    'Disponible',
    'Ocupado',
    'Mantenimiento'
);


ALTER TYPE public.estado_consultorio OWNER TO postgres;

--
-- Name: estadocita; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estadocita AS ENUM (
    'PROGRAMADA',
    'REGISTRADA',
    'EN_PROGRESO',
    'COMPLETADA',
    'CANCELADA',
    'Pendiente'
);


ALTER TYPE public.estadocita OWNER TO postgres;

--
-- Name: estadoconsultorio; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estadoconsultorio AS ENUM (
    'DISPONIBLE',
    'OCUPADO',
    'MANTENIMIENTO'
);


ALTER TYPE public.estadoconsultorio OWNER TO postgres;

--
-- Name: genero; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.genero AS ENUM (
    'Masculino',
    'Femenino',
    'Otro'
);


ALTER TYPE public.genero OWNER TO postgres;

--
-- Name: tipo_entrada; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_entrada AS ENUM (
    'Revisión',
    'Vacunación',
    'Enfermedad',
    'Lesión',
    'Especialista'
);


ALTER TYPE public.tipo_entrada OWNER TO postgres;

--
-- Name: tipoentrada; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipoentrada AS ENUM (
    'REVISION',
    'VACUNACION',
    'ENFERMEDAD',
    'LESION',
    'ESPECIALISTA'
);


ALTER TYPE public.tipoentrada OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alergias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alergias (
    id integer NOT NULL,
    paciente_id integer NOT NULL,
    nombre character varying(200) NOT NULL
);


ALTER TABLE public.alergias OWNER TO postgres;

--
-- Name: alergias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alergias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alergias_id_seq OWNER TO postgres;

--
-- Name: alergias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alergias_id_seq OWNED BY public.alergias.id;


--
-- Name: cita_estados_historial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cita_estados_historial (
    id bigint NOT NULL,
    cita_id bigint NOT NULL,
    estado public.estado_cita NOT NULL,
    cambiado_en timestamp with time zone DEFAULT now() NOT NULL,
    cambiado_por bigint
);


ALTER TABLE public.cita_estados_historial OWNER TO postgres;

--
-- Name: cita_estados_historial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cita_estados_historial_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cita_estados_historial_id_seq OWNER TO postgres;

--
-- Name: cita_estados_historial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cita_estados_historial_id_seq OWNED BY public.cita_estados_historial.id;


--
-- Name: citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.citas (
    id bigint NOT NULL,
    paciente_id bigint NOT NULL,
    consultorio_id bigint NOT NULL,
    fecha_programada date NOT NULL,
    hora_programada time without time zone NOT NULL,
    estado public.estado_cita DEFAULT 'Programada'::public.estado_cita NOT NULL,
    motivo character varying(200),
    creado_por bigint,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    cancelado_en timestamp with time zone
);


ALTER TABLE public.citas OWNER TO postgres;

--
-- Name: citas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.citas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.citas_id_seq OWNER TO postgres;

--
-- Name: citas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.citas_id_seq OWNED BY public.citas.id;


--
-- Name: pacientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pacientes (
    id bigint NOT NULL,
    nombre character varying(120) NOT NULL,
    apellido character varying(120) NOT NULL,
    fecha_nac date NOT NULL,
    genero public.genero NOT NULL,
    tutor_nombre character varying(200) NOT NULL,
    tutor_email character varying(200) NOT NULL,
    tutor_telefono character varying(50),
    creado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pacientes OWNER TO postgres;

--
-- Name: cola_hoy; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.cola_hoy AS
 SELECT c.id,
    to_char((c.hora_programada)::interval, 'HH12:MI AM'::text) AS hora,
    (((p.nombre)::text || ' '::text) || (p.apellido)::text) AS paciente,
    (EXTRACT(year FROM age((CURRENT_DATE)::timestamp with time zone, (p.fecha_nac)::timestamp with time zone)))::integer AS edad,
    COALESCE(c.motivo, '—'::character varying) AS motivo,
    (c.estado)::text AS estado,
    p.tutor_nombre AS tutor,
    p.tutor_email AS email,
    p.tutor_telefono AS telefono,
    to_char(c.creado_en, 'YYYY-MM-DD HH24:MI'::text) AS created_at
   FROM (public.citas c
     JOIN public.pacientes p ON ((p.id = c.paciente_id)))
  WHERE (c.fecha_programada = CURRENT_DATE)
  ORDER BY c.hora_programada;


ALTER VIEW public.cola_hoy OWNER TO postgres;

--
-- Name: consultorio_recursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultorio_recursos (
    id bigint NOT NULL,
    consultorio_id bigint NOT NULL,
    recurso character varying(200) NOT NULL
);


ALTER TABLE public.consultorio_recursos OWNER TO postgres;

--
-- Name: consultorio_recursos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultorio_recursos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultorio_recursos_id_seq OWNER TO postgres;

--
-- Name: consultorio_recursos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultorio_recursos_id_seq OWNED BY public.consultorio_recursos.id;


--
-- Name: consultorios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultorios (
    id bigint NOT NULL,
    nombre character varying(200) NOT NULL,
    numero character varying(50) NOT NULL,
    piso integer NOT NULL,
    especialidad character varying(200) NOT NULL,
    medico character varying(200) NOT NULL,
    estado public.estado_consultorio DEFAULT 'Disponible'::public.estado_consultorio NOT NULL,
    capacidad integer NOT NULL,
    horario character varying(200) NOT NULL,
    ubicacion character varying(200) NOT NULL,
    notas text,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now(),
    CONSTRAINT consultorios_capacidad_check CHECK ((capacidad > 0))
);


ALTER TABLE public.consultorios OWNER TO postgres;

--
-- Name: consultorios_con_recursos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.consultorios_con_recursos AS
SELECT
    NULL::bigint AS id,
    NULL::character varying(200) AS nombre,
    NULL::character varying(50) AS numero,
    NULL::integer AS piso,
    NULL::character varying(200) AS especialidad,
    NULL::character varying(200) AS medico,
    NULL::public.estado_consultorio AS estado,
    NULL::integer AS capacidad,
    NULL::character varying(200) AS horario,
    NULL::character varying(200) AS ubicacion,
    NULL::text AS notas,
    NULL::timestamp with time zone AS creado_en,
    NULL::timestamp with time zone AS actualizado_en,
    NULL::character varying[] AS recursos;


ALTER VIEW public.consultorios_con_recursos OWNER TO postgres;

--
-- Name: consultorios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultorios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultorios_id_seq OWNER TO postgres;

--
-- Name: consultorios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultorios_id_seq OWNED BY public.consultorios.id;


--
-- Name: expediente_entradas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expediente_entradas (
    id bigint NOT NULL,
    paciente_id bigint NOT NULL,
    tipo public.tipo_entrada NOT NULL,
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    altura_cm numeric(5,2),
    peso_kg numeric(5,2),
    temperatura_c numeric(4,1),
    creado_por bigint,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    descripcion text NOT NULL
);


ALTER TABLE public.expediente_entradas OWNER TO postgres;

--
-- Name: expediente_entradas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expediente_entradas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expediente_entradas_id_seq OWNER TO postgres;

--
-- Name: expediente_entradas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expediente_entradas_id_seq OWNED BY public.expediente_entradas.id;


--
-- Name: logs_auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs_auditoria (
    id integer NOT NULL,
    usuario_id integer,
    accion character varying(100) NOT NULL,
    tabla character varying(100),
    registro_id integer,
    detalles text,
    fecha timestamp with time zone DEFAULT now(),
    username character varying(100)
);


ALTER TABLE public.logs_auditoria OWNER TO postgres;

--
-- Name: logs_auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_auditoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_auditoria_id_seq OWNER TO postgres;

--
-- Name: logs_auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_auditoria_id_seq OWNED BY public.logs_auditoria.id;


--
-- Name: medicamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicamentos (
    id integer NOT NULL,
    paciente_id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    dosis character varying(200)
);


ALTER TABLE public.medicamentos OWNER TO postgres;

--
-- Name: medicamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medicamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medicamentos_id_seq OWNER TO postgres;

--
-- Name: medicamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medicamentos_id_seq OWNED BY public.medicamentos.id;


--
-- Name: pacientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pacientes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pacientes_id_seq OWNER TO postgres;

--
-- Name: pacientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pacientes_id_seq OWNED BY public.pacientes.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id bigint NOT NULL,
    nombre character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    password_hash text NOT NULL,
    rol character varying(50) DEFAULT 'paciente'::character varying NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    username character varying(100) NOT NULL,
    telefono character varying(50),
    fecha_ingreso date,
    identificacion_oficial character varying(200),
    direccion text,
    rfc character varying(20),
    medico_id integer,
    especialidad character varying(200),
    cedula_profesional character varying(100),
    universidad_egreso character varying(200),
    horario_atencion character varying(200),
    consultorio_pref character varying(100)
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: alergias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alergias ALTER COLUMN id SET DEFAULT nextval('public.alergias_id_seq'::regclass);


--
-- Name: cita_estados_historial id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita_estados_historial ALTER COLUMN id SET DEFAULT nextval('public.cita_estados_historial_id_seq'::regclass);


--
-- Name: citas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas ALTER COLUMN id SET DEFAULT nextval('public.citas_id_seq'::regclass);


--
-- Name: consultorio_recursos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorio_recursos ALTER COLUMN id SET DEFAULT nextval('public.consultorio_recursos_id_seq'::regclass);


--
-- Name: consultorios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorios ALTER COLUMN id SET DEFAULT nextval('public.consultorios_id_seq'::regclass);


--
-- Name: expediente_entradas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente_entradas ALTER COLUMN id SET DEFAULT nextval('public.expediente_entradas_id_seq'::regclass);


--
-- Name: logs_auditoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria ALTER COLUMN id SET DEFAULT nextval('public.logs_auditoria_id_seq'::regclass);


--
-- Name: medicamentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamentos ALTER COLUMN id SET DEFAULT nextval('public.medicamentos_id_seq'::regclass);


--
-- Name: pacientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN id SET DEFAULT nextval('public.pacientes_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: alergias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alergias (id, paciente_id, nombre) FROM stdin;
1	21	lacteos
2	21	cacahuates
3	21	Flojera
4	22	penicilina
\.


--
-- Data for Name: cita_estados_historial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cita_estados_historial (id, cita_id, estado, cambiado_en, cambiado_por) FROM stdin;
\.


--
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.citas (id, paciente_id, consultorio_id, fecha_programada, hora_programada, estado, motivo, creado_por, creado_en, actualizado_en, cancelado_en) FROM stdin;
2	5	6	2026-03-12	16:30:00	Programada	🤒 No me siento bien	\N	2026-03-12 12:24:17.789478-06	2026-03-12 12:24:17.789478-06	\N
1	4	5	2026-03-12	15:00:00	Registrada	🏃 Examen Físico Deportivo	\N	2026-03-12 11:37:32.308185-06	2026-03-12 13:20:47.705631-06	\N
5	8	5	2026-03-12	13:30:00	Completada	👂 Problemas de Oído	\N	2026-03-12 13:00:08.691521-06	2026-03-12 13:58:32.566068-06	\N
4	7	5	2026-03-12	14:30:00	En Progreso	🩺 Chequeo Anual	\N	2026-03-12 12:42:14.429074-06	2026-03-12 13:58:53.001344-06	\N
6	9	5	2026-03-13	09:00:00	Completada	👂 Problemas de Oído	\N	2026-03-12 22:55:53.349009-06	2026-03-12 23:01:02.951119-06	\N
7	10	6	2026-03-13	10:00:00	Programada	🤧 Alergias	\N	2026-03-12 23:46:34.468981-06	2026-03-12 23:46:34.468981-06	\N
8	11	6	2026-03-19	15:00:00	Completada	🏃 Examen Físico Deportivo	\N	2026-03-19 10:51:49.211635-06	2026-03-19 10:54:27.320444-06	\N
9	12	5	2026-03-26	16:30:00	Programada	👂 Problemas de Oído	\N	2026-03-26 14:38:45.952134-06	2026-03-26 14:38:45.952134-06	\N
11	14	6	2026-03-26	15:30:00	En Progreso	🩺 Chequeo Anual	\N	2026-03-26 14:53:00.727913-06	2026-03-26 14:58:57.301115-06	\N
3	6	5	2026-03-26	11:00:00	Completada	🔁 Visita de Seguimiento	\N	2026-03-12 12:28:13.468733-06	2026-03-26 15:00:07.333678-06	\N
10	13	5	2026-03-26	16:00:00	Registrada	💉 Vacunación	\N	2026-03-26 14:46:17.923215-06	2026-03-26 15:01:36.648529-06	\N
12	15	6	2026-03-30	15:30:00	Programada	🔁 Visita de Seguimiento	\N	2026-03-30 11:45:39.601598-06	2026-03-30 11:45:39.601598-06	\N
13	21	5	2026-04-02	09:00:00	Completada	👂 Problemas de Oído	\N	2026-04-01 22:09:46.906936-06	2026-04-02 01:31:42.599201-06	\N
16	24	6	2026-04-02	10:30:00	Programada	💉 Vacunación	\N	2026-04-02 01:31:30.35893-06	2026-04-02 14:58:51.887394-06	\N
14	22	5	2026-04-02	09:30:00	Completada	🏃 Examen Físico Deportivo	\N	2026-04-02 00:48:31.171621-06	2026-04-02 14:59:07.53117-06	\N
15	23	6	2026-04-02	10:00:00	En Progreso	🤒 No me siento bien	\N	2026-04-02 00:50:33.765759-06	2026-04-02 14:59:19.691801-06	\N
17	25	5	2026-04-07	11:00:00	Completada	👂 Problemas de Oído	\N	2026-04-07 10:52:45.222599-06	2026-04-07 10:55:46.180676-06	\N
18	26	5	2026-04-07	13:00:00	Programada	💉 Vacunación	\N	2026-04-07 12:24:57.7846-06	2026-04-07 12:25:36.917279-06	\N
19	27	6	2026-04-09	16:30:00	En Progreso	🏃 Examen Físico Deportivo	\N	2026-04-09 16:23:11.688273-06	2026-04-09 16:30:55.903783-06	\N
20	28	6	2026-04-16	14:00:00	Completada	🤧 Alergias	\N	2026-04-16 13:57:36.727053-06	2026-04-16 15:11:11.570108-06	\N
21	29	5	2026-04-20	16:30:00	En Progreso	💉 Vacunación	\N	2026-04-20 12:04:13.197811-06	2026-04-20 12:53:43.456655-06	\N
22	30	6	2026-04-23	16:30:00	Cancelada	🤧 Alergias	\N	2026-04-23 13:33:25.708251-06	2026-04-23 13:51:58.098525-06	\N
23	31	6	2026-04-23	16:30:00	Cancelada	🏃 Examen Físico Deportivo	\N	2026-04-23 13:52:54.025494-06	2026-05-05 15:44:02.277425-06	\N
24	32	6	2026-05-05	16:00:00	Cancelada		\N	2026-05-05 15:54:47.562168-06	2026-05-05 15:59:04.582392-06	\N
25	33	5	2026-05-05	16:30:00	Cancelada	🏃 Examen Físico Deportivo	\N	2026-05-05 16:15:20.084822-06	2026-05-05 16:16:17.32284-06	\N
26	34	5	2026-05-05	16:30:00	Cancelada	👂 Problemas de Oído	\N	2026-05-05 16:17:35.323327-06	2026-05-05 16:17:45.111508-06	\N
\.


--
-- Data for Name: consultorio_recursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultorio_recursos (id, consultorio_id, recurso) FROM stdin;
3	6	jgjj
6	5	holassss
\.


--
-- Data for Name: consultorios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultorios (id, nombre, numero, piso, especialidad, medico, estado, capacidad, horario, ubicacion, notas, creado_en, actualizado_en) FROM stdin;
6	Consultorio Emergencias Pediátricas 	C-007	1	Emergencias 	Dra. Sofia Herrera	Disponible	2	24/7	Edificio Urgencias	vbcbncvn	2026-03-12 11:30:41.947441-06	2026-03-12 11:31:30.3185-06
5	Consultorio Pediatría	C-001	1	Pediatría General	Dra. Ana López	Disponible	1	 08:00 - 16:00	Ala Norte	Equipado con ultrasonido"	2026-03-11 17:16:38.020207-06	2026-04-01 21:31:10.240921-06
\.


--
-- Data for Name: expediente_entradas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expediente_entradas (id, paciente_id, tipo, fecha, altura_cm, peso_kg, temperatura_c, creado_por, creado_en, actualizado_en, descripcion) FROM stdin;
3	4	Enfermedad	2026-03-12	1.50	65.00	67.0	\N	2026-03-12 11:58:56.327417-06	2026-03-12 11:58:56.327417-06	htjgjhgj
4	4	Lesión	2026-03-12	1.30	60.00	56.0	\N	2026-03-12 12:21:05.831352-06	2026-03-12 12:21:05.831352-06	hhfg
5	5	Vacunación	2026-03-12	1.23	45.00	43.0	\N	2026-03-12 12:25:47.083554-06	2026-03-12 12:25:47.083554-06	gngng
6	8	Enfermedad	2026-03-12	1.14	34.00	54.0	\N	2026-03-12 13:00:39.500968-06	2026-03-12 13:00:39.500968-06	hh
7	11	Vacunación	2026-03-19	1.65	65.00	67.0	\N	2026-03-19 10:57:14.320607-06	2026-03-19 10:57:14.320607-06	hfhfhfhf
8	21	Revisión	2026-04-01	1.63	65.00	39.0	\N	2026-04-01 22:44:18.08858-06	2026-04-01 22:44:18.08858-06	hhhh
10	22	Vacunación	2026-04-02	1.45	40.00	65.0	\N	2026-04-02 14:58:18.496921-06	2026-04-02 14:58:18.496921-06	vmcvnvc
11	27	Revisión	2026-04-09	1.65	30.00	65.0	\N	2026-04-09 16:26:31.834405-06	2026-04-09 16:26:31.834405-06	ddjdjdjdj
12	27	Vacunación	2026-04-09	1.85	45.00	60.0	\N	2026-04-09 16:27:57.500498-06	2026-04-09 16:27:57.500498-06	jfjfjfj
\.


--
-- Data for Name: logs_auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs_auditoria (id, usuario_id, accion, tabla, registro_id, detalles, fecha, username) FROM stdin;
1	2	LOGIN	usuarios	2	{"email": "admin@hospital5.com"}	2026-04-09 15:55:55.00045-06	\N
2	2	LOGIN	usuarios	2	{"email": "admin@hospital5.com"}	2026-04-09 15:57:11.947076-06	\N
3	2	LOGIN	usuarios	2	{"email": "admin@hospital5.com"}	2026-04-09 16:00:57.467843-06	\N
4	2	LOGIN	usuarios	2	{"email": "admin@hospital5.com"}	2026-04-09 16:01:29.102547-06	\N
5	\N	EDITAR	citas	19	{"campo": "estado", "anterior": "Programada", "nuevo": "Registrada"}	2026-04-09 16:23:50.926559-06	\N
6	\N	EDITAR	citas	19	{"campo": "estado", "anterior": "Registrada", "nuevo": "En Progreso"}	2026-04-09 16:30:55.91002-06	\N
7	2	LOGIN	usuarios	2	{"email": "admin@hospital5.com"}	2026-04-09 17:43:53.234285-06	\N
8	4	LOGIN	usuarios	4	{"email": "cristiano15@gmail.com"}	2026-04-09 17:46:04.95262-06	\N
9	4	LOGIN	usuarios	4	{"email": "cristiano15@gmail.com"}	2026-04-09 18:05:50.810203-06	\N
10	5	LOGIN	usuarios	5	{"email": "messi15@gmail.com"}	2026-04-09 18:06:56.697037-06	\N
11	6	LOGIN	usuarios	6	{"email": "neymar15@gmail.com"}	2026-04-09 18:12:26.830912-06	\N
12	7	LOGIN	usuarios	7	{"email": "henrry21@gmail.com"}	2026-04-09 18:18:11.12627-06	\N
13	7	LOGIN	usuarios	7	{"email": "henrry21@gmail.com"}	2026-04-09 18:33:24.67246-06	\N
14	7	LOGIN	usuarios	7	{"email": "henrry21@gmail.com"}	2026-04-09 18:34:29.100869-06	\N
15	8	LOGIN	usuarios	8	{"email": "alejandro10@gmail.com"}	2026-04-09 18:40:16.530584-06	\N
16	8	LOGIN	usuarios	8	{"email": "alejandro10@gmail.com"}	2026-04-13 12:44:40.471489-06	\N
17	9	LOGIN	usuarios	9	{"username": "griezman19"}	2026-04-14 14:45:23.429375-06	\N
18	9	LOGIN	usuarios	9	{"username": "griezman19"}	2026-04-14 14:47:11.769258-06	\N
19	9	LOGIN	usuarios	9	{"username": "griezman19"}	2026-04-14 14:47:48.8613-06	\N
20	9	LOGIN	usuarios	9	{"username": "griezman19"}	2026-04-14 14:50:19.109144-06	\N
21	9	LOGIN	usuarios	9	{"username": "griezman19"}	2026-04-14 15:35:03.523715-06	\N
22	9	LOGIN	usuarios	9	{"username": "griezman19"}	2026-04-14 15:36:23.238335-06	\N
23	9	LOGIN	usuarios	9	{"username": "griezman19"}	2026-04-14 15:38:21.057687-06	\N
24	10	LOGIN	usuarios	10	{"username": "angel_19@gmail.com"}	2026-04-14 15:41:42.808346-06	\N
25	10	LOGIN	usuarios	10	{"username": "angel_19@gmail.com"}	2026-04-14 15:49:27.993083-06	\N
26	10	LOGIN	usuarios	10	{"username": "angel_19@gmail.com"}	2026-04-14 15:53:12.137449-06	\N
27	11	LOGIN	usuarios	11	{"username": "user_11"}	2026-04-14 15:55:46.844099-06	\N
28	11	LOGIN	usuarios	11	{"username": "user_11"}	2026-04-14 15:56:33.626245-06	\N
29	11	LOGIN	usuarios	11	{"username": "user_11"}	2026-04-14 15:57:21.435425-06	\N
30	11	LOGIN	usuarios	11	{"username": "user_11"}	2026-04-16 13:41:08.762087-06	\N
31	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-16 13:45:08.827869-06	\N
32	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-16 13:45:39.431401-06	\N
35	\N	EDITAR	citas	20	{"campo": "estado", "anterior": "Programada", "nuevo": "Registrada"}	2026-04-16 14:47:55.821816-06	\N
36	\N	EDITAR	citas	20	{"campo": "estado", "anterior": "Registrada", "nuevo": "En Progreso"}	2026-04-16 14:50:46.610032-06	\N
38	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-16 14:53:34.960585-06	\N
39	11	LOGIN	usuarios	11	{"username": "user_11"}	2026-04-16 14:56:00.472127-06	\N
40	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-16 14:59:03.134505-06	\N
41	\N	EDITAR	citas	20	{"campo": "estado", "anterior": "En Progreso", "nuevo": "Completada"}	2026-04-16 15:11:11.599744-06	\N
44	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-16 15:15:39.989685-06	\N
46	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-16 16:23:21.71426-06	\N
47	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-16 16:23:55.549502-06	\N
48	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-16 16:27:21.887866-06	\N
51	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-16 16:28:10.163908-06	\N
52	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-16 16:32:25.182947-06	\N
53	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-16 18:02:24.802863-06	\N
54	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-16 18:02:58.314979-06	\N
55	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-16 18:03:23.371328-06	\N
56	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-20 10:55:14.93921-06	\N
57	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-20 11:22:50.175623-06	\N
59	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-20 12:05:36.366423-06	\N
60	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-20 12:50:08.800307-06	\N
62	\N	EDITAR	citas	21	{"campo": "estado", "anterior": "Programada", "nuevo": "Registrada"}	2026-04-20 12:53:36.757022-06	\N
63	\N	EDITAR	citas	21	{"campo": "estado", "anterior": "Registrada", "nuevo": "En Progreso"}	2026-04-20 12:53:43.460253-06	\N
64	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-20 12:53:58.826421-06	\N
66	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-20 18:07:59.602746-06	\N
68	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-20 18:14:51.357818-06	\N
69	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-20 18:15:17.484507-06	\N
70	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-20 18:15:27.065197-06	\N
71	9	LOGIN	usuarios	9	{"username": "griezman19"}	2026-04-20 18:15:40.340542-06	\N
72	9	LOGIN	usuarios	9	{"username": "griezman19"}	2026-04-20 18:15:49.433039-06	\N
73	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-20 18:15:59.135063-06	\N
75	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-20 18:17:14.571901-06	\N
76	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-20 18:18:20.011264-06	\N
77	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-20 18:25:00.502613-06	\N
78	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-20 18:33:03.92041-06	\N
79	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-22 11:59:33.629287-06	\N
80	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-22 11:59:53.895961-06	\N
81	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-22 12:16:02.920735-06	\N
82	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-22 12:35:27.894527-06	\N
83	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-22 12:52:38.831546-06	\N
84	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-22 13:12:08.179401-06	\N
85	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-22 15:48:36.722979-06	\N
86	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-22 16:22:25.558602-06	\N
33	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-16 13:59:07.281403-06	\N
34	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-16 14:00:58.003904-06	\N
37	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-16 14:51:53.423-06	\N
42	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-16 15:14:46.629283-06	\N
43	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-16 15:15:30.543686-06	\N
45	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-16 16:08:09.252134-06	\N
49	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-16 16:27:53.961553-06	\N
50	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-16 16:28:02.98699-06	\N
58	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-20 12:04:34.060352-06	\N
61	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-20 12:53:24.945788-06	\N
65	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-20 13:53:45.069961-06	\N
67	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-20 18:12:42.871072-06	\N
74	\N	LOGIN	usuarios	13	{"username": "maria10"}	2026-04-20 18:16:34.144814-06	\N
87	17	LOGIN	usuarios	17	{"username": "ivan24"}	2026-04-22 16:33:35.674621-06	\N
88	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-22 16:34:56.834135-06	\N
89	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-22 16:35:28.551503-06	\N
90	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-04-22 16:35:45.310385-06	\N
91	18	LOGIN	usuarios	18	{"username": "maria10"}	2026-04-22 16:39:01.91708-06	\N
92	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-22 20:57:11.431166-06	\N
93	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-23 13:00:07.563992-06	\N
94	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-23 13:04:50.740475-06	\N
95	\N	CANCELAR	citas	22	{"campo": "estado", "anterior": "Pendiente", "nuevo": "Cancelada"}	2026-04-23 13:51:58.142244-06	\N
96	18	LOGIN	usuarios	18	{"username": "maria10"}	2026-04-23 15:12:11.965929-06	\N
97	\N	EDITAR	citas	23	{"campo": "estado", "anterior": "Programada", "nuevo": "Registrada"}	2026-04-23 15:23:03.651928-06	\N
98	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-23 15:25:26.833766-06	\N
99	18	LOGIN	usuarios	18	{"username": "maria10"}	2026-04-23 15:25:46.993826-06	\N
100	18	LOGIN	usuarios	18	{"username": "maria10"}	2026-04-24 17:14:36.721533-06	\N
101	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-04-24 17:17:50.769456-06	\N
102	15	LOGIN	usuarios	15	{"username": "german19"}	2026-04-24 17:23:19.724183-06	\N
103	15	LOGIN	usuarios	15	{"username": "german19"}	2026-05-05 15:37:17.016088-06	\N
104	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-05-05 15:37:24.269559-06	\N
105	18	LOGIN	usuarios	18	{"username": "maria10"}	2026-05-05 15:37:33.374906-06	\N
106	\N	EDITAR	citas	23	{"campo": "estado", "anterior": "Registrada", "nuevo": "Cancelada"}	2026-05-05 15:44:02.304616-06	\N
107	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-05-05 15:48:16.346881-06	\N
108	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-05-05 15:48:22.407657-06	\N
109	18	LOGIN	usuarios	18	{"username": "maria10"}	2026-05-05 15:48:28.680783-06	\N
110	18	LOGIN	usuarios	18	{"username": "maria10"}	2026-05-05 15:48:36.355898-06	\N
111	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-05-05 15:49:09.668702-06	\N
112	17	LOGIN	usuarios	17	{"username": "ivan24"}	2026-05-05 15:49:19.961297-06	\N
113	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-05-05 15:50:41.126764-06	\N
114	18	LOGIN	usuarios	18	{"username": "maria10"}	2026-05-05 15:56:19.704603-06	\N
115	\N	EDITAR	citas	24	{"campo": "estado", "anterior": "Programada", "nuevo": "Registrada"}	2026-05-05 15:57:08.285972-06	\N
116	\N	EDITAR	citas	24	{"campo": "estado", "anterior": "Registrada", "nuevo": "Cancelada"}	2026-05-05 15:59:04.601452-06	\N
117	12	LOGIN	usuarios	12	{"username": "marcos10"}	2026-05-05 16:01:10.781374-06	\N
118	\N	CANCELAR	citas	25	{"campo": "estado", "anterior": "Pendiente", "nuevo": "Cancelada"}	2026-05-05 16:16:17.342125-06	\N
119	\N	CANCELAR	citas	26	{"campo": "estado", "anterior": "Pendiente", "nuevo": "Cancelada"}	2026-05-05 16:17:45.130045-06	\N
120	15	LOGIN	usuarios	15	{"username": "german19"}	2026-05-05 16:18:47.04505-06	\N
121	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-05-05 16:27:24.353121-06	\N
122	14	LOGIN	usuarios	14	{"username": "carlos15"}	2026-05-05 17:35:51.24667-06	\N
123	18	LOGIN	usuarios	18	{"username": "maria10"}	2026-05-05 17:37:21.679831-06	\N
124	15	LOGIN	usuarios	15	{"username": "german19"}	2026-05-05 17:38:59.693973-06	\N
\.


--
-- Data for Name: medicamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicamentos (id, paciente_id, nombre, dosis) FROM stdin;
1	21	alin	1 pastilla cada 8 horas
2	21	analgen	1 cada 8 h
3	21	Nex	2 cada 5 h
4	22	Aliviax	1 cada 7 h
\.


--
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pacientes (id, nombre, apellido, fecha_nac, genero, tutor_nombre, tutor_email, tutor_telefono, creado_en) FROM stdin;
4	Jose	Martin	2026-03-14	Masculino	Carlos Martin	carlosM@gmail.com	9999999999	2026-03-12 11:37:32.308185-06
5	Karla	Gonzalez	2007-11-14	Femenino	María Lopez	María@gmail.com	8888888888	2026-03-12 12:24:17.789478-06
6	Max	Calan	2008-06-12	Masculino	Messi Calan	MessiC@gmail.com	7777777777	2026-03-12 12:28:13.468733-06
7	Cristiano Ronaldo	Chan	2017-01-12	Masculino	Messi Chan	cmessi@gmail.com	4444444444	2026-03-12 12:42:14.429074-06
8	Jazmin	Kuk	2005-08-18	Femenino	Angelica Kuk	AngelicaK@gmail.com	4444444444	2026-03-12 13:00:08.691521-06
9	Maria 	Lopez	2006-06-15	Femenino	Karla Lopez	karlap@gmail.com	9999999999	2026-03-12 22:55:53.349009-06
10	Angel	Malagon	2002-11-15	Masculino	Alejandro Zendejas	AlejandroZ@gmail.com	5555555555	2026-03-12 23:46:34.468981-06
11	Loenel	Lopez	2003-07-19	Masculino	Carlos Lopez	CarlosL@gmail.com	4444444444	2026-03-19 10:51:49.211635-06
12	Mauricio 	Martin	2008-06-25	Masculino	Carlos Martin	carlosm15@gmail.com	8888888888	2026-03-26 14:38:45.952134-06
13	Matheus	Rivera	2014-02-19	Masculino	Gustavo Rivera	gusrivera14@gmail.com	7777777777	2026-03-26 14:46:17.923215-06
14	Jimena	Herrera	2013-07-17	Femenino	Jazmín Herrera	jazminherrera@gmail.com	9999999999	2026-03-26 14:53:00.727913-06
15	Carlos	Martinez	2009-06-09	Masculino	Mario Matinez	Mariocm@gmail.com	9999999999	2026-03-30 11:45:39.601598-06
21	gdgdgd	gfgdgd	2015-10-21	Femenino	dfdgdg	yaelchan15@gmail.com	5555555555	2026-04-01 22:09:46.906936-06
22	Julia	Segura	2019-02-14	Femenino	Maria Segura	mariase@gmail.com	6666666666	2026-04-02 00:48:31.171621-06
23	Mario	Tec	2014-08-12	Masculino	German Tec	German@gmail.com	8888888888	2026-04-02 00:50:33.765759-06
24	Eduardo	lopez	2008-09-28	Masculino	Maria Lopez	marialopez@gmail.com	9999999999	2026-04-02 01:31:30.35893-06
25	Pedro	Lopez	2016-06-07	Masculino	Mario Lopez	mario@gmail.com	9999999999	2026-04-07 10:52:45.222599-06
26	Ivan	Herrera	2016-07-07	Masculino	Jesus Herrera	yaelchan15@gmail.com	8888888888	2026-04-07 12:24:57.7846-06
27	Liliana 	May	2019-06-04	Femenino	Izaide May	izaide@gmail.com	1111111111	2026-04-09 16:23:11.688273-06
28	Jana	Chan	2024-05-19	Femenino	Yael Chan	yaelchan15@gmail.com	9999999999	2026-04-16 13:57:36.727053-06
29	Jana 	Ordoñez	2024-05-19	Femenino	Katty Ordoñez	yaelchan15@gmail.com	9999999999	2026-04-20 12:04:13.197811-06
30	Kiana	Palacios	2019-08-19	Femenino	Marcos Alonzo	yaelchan15@gmail.com	8888888888	2026-04-23 13:33:25.708251-06
31	Kiana 	Alonzo Palacios	2019-02-19	Femenino	Marcos Alonzo	yaelchan15@gmail.com	7777777777	2026-04-23 13:52:54.025494-06
32	Maria	Alonzo	2020-09-14	Femenino	Marcos Alonzo	yaelchan15@gmail.com	8888888888	2026-05-05 15:54:47.562168-06
33	Mario	Alonzo	2020-09-18	Masculino	Marcos Alonzo	yaelchan15@gmail.com	3333333333	2026-05-05 16:15:20.084822-06
34	Jesus	Alonzo	2018-07-17	Masculino	Marcos Alonzo	yaelchan15@gmail.com	0000000000	2026-05-05 16:17:35.323327-06
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, password_hash, rol, activo, creado_en, username, telefono, fecha_ingreso, identificacion_oficial, direccion, rfc, medico_id, especialidad, cedula_profesional, universidad_egreso, horario_atencion, consultorio_pref) FROM stdin;
1	Juan Pérez	juan.perez@clinica.com	123456H@	admin	t	2026-03-11 15:11:47.069662-06	user_1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	pediatría	admin@pediatria.com	$2b$12$WCw.d3MR53odA.cSSnUDjOVgroGtg8OmBwWHVwI8mCvvBje4DI3j2	staff	t	2026-03-12 12:13:35.978438-06	user_3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	hospital 	admin@hospital5.com	$2b$12$U059zrHw7GSrN1AcNO4yKuVPSIqyAhKZi7qhVnA2ZeteJLKThKsEq	staff	t	2026-03-11 16:37:21.348705-06	user_2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	Cristiano Ronaldo	cristiano15@gmail.com	$2b$12$w32oLdD5QwXuDMZHshFaEuFdBkW3pk3XxQtX1bbKTxiox9MODWd5y	medico	t	2026-04-09 17:45:45.746093-06	user_4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	Messi	messi15@gmail.com	$2b$12$QUSLyk91ST.rihvtTkW64e0vheL5hazIP/C44nMysdQvbeVPn/CZi	staff	t	2026-04-09 18:06:48.564937-06	user_5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	Neymar	neymar15@gmail.com	$2b$12$9Hy8BWuHfvau11MB5RgGEONayl0NWA.BLce9NdQJFMM5smLPC1TP6	admin	t	2026-04-09 18:11:47.39411-06	user_6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	Henrry Martin	henrry21@gmail.com	$2b$12$h0XVnszPSYOXddAl6iawGeeWC2upokZZraQkfSaSrllf7dURkF85S	tutor	t	2026-04-09 18:17:33.627631-06	user_7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	Alendro Zendejas	alejandro10@gmail.com	$2b$12$pYN8Rk2p5nDv.vyhxgbp9eLgXrmxVd5MhXKzQ4Lu9SzyQk6R5QJ4.	admin	t	2026-04-09 18:40:11.615895-06	user_8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	Antonie Griezman	griezman19@gmail.com	$2b$12$mMXaXQrj8gMgPbS3dTcNe.am0OlO2j1NASgzAYKdEu6dJl4jK1W9G	paciente	t	2026-04-14 14:45:15.245741-06	griezman19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	Angel Jesus	angel_19@gmail.com	$2b$12$WpVn2nRPcEd/H66ICPpfsuTBQN7GGf1OHigtZhboEMorTwqxfmoCe	paciente	t	2026-04-14 15:41:35.654743-06	angel_19@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	Yael Jesus	yael15@gmail.com	$2b$12$OK/at36TAyDXLCGDhHslve.XnZV9/sqIlyP8gzyUEnSX3uaAu.Cke	admin	t	2026-04-14 15:55:38.355413-06	user_11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	Carlos Rodriguez	carlos15@gmail.com	$2b$12$m8ORPPfdCwBscB4fg7.x5.OMcWzj1NtO73BWwMNsKzHNdmkRml3sS	medico	t	2026-04-16 14:58:18.167841-06	carlos15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	German Ordoñez	german19@gmail.com	$2b$12$Ne2GwoPgMmtXdceZqySCFefQ8fmYaVt7dmxLeG5ToU71RH.A6QjOW	admin	t	2026-04-16 16:25:42.670872-06	german19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	Marcos Alonzo	yaelchan15@gmail.com	$2b$12$znNDWiATgWtwrpN.I50WyuO1D/4ctv2.do.C1SdTI33YP1TKafL/6	paciente	t	2026-04-16 13:45:01.224201-06	marcos10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	José Martin García	josemg@gmail.com	$2b$12$nfcohBzMenVjwuwfUUSpcenzkgOR6PHoCgthmSVSRLE4Z2ptH5ma6	recepcionista	t	2026-04-22 12:51:22.255733-06	jose4	8888888888	2026-04-22	P<MEXPEREZ<GARCIA<<JUAN<<<<<<<<<<<<<< X12345678MEX9001151M2403012<<<<<<<<<<	Calle 35 entre 19 y 17 SN	RFC123456ABC	14	\N	\N	\N	\N	\N
17	Iván Martin López	ivan@gmail.com	$2b$12$2YLGDhdSQet1I626pbnL1.u/sLeHsH/iEg./0GCzyQoS82zdNXOXy	admin	t	2026-04-22 16:32:54.962633-06	ivan24		2026-04-22				\N					
18	María Ordoñez Jiménez 	maria10@gmail.com	$2b$12$MeUhsOkiQDxhNmiCWVpyI.d2hfI1CuxJmzVktDUaJyRJkS20p9IZe	recepcionista	t	2026-04-22 16:38:42.083664-06	maria10	9999999999	2026-04-22	P<MEXPEREZ<GARCIA<<JUAN<<<<<<<<<<<<<< X12345678MEX9001151M2403013<<<<<<<<<<	Calle 45 entre 15 y 15 SN	PEMJ900115HDFRRN09	\N					
\.


--
-- Name: alergias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alergias_id_seq', 4, true);


--
-- Name: cita_estados_historial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cita_estados_historial_id_seq', 1, false);


--
-- Name: citas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.citas_id_seq', 26, true);


--
-- Name: consultorio_recursos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultorio_recursos_id_seq', 6, true);


--
-- Name: consultorios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultorios_id_seq', 6, true);


--
-- Name: expediente_entradas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expediente_entradas_id_seq', 12, true);


--
-- Name: logs_auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_auditoria_id_seq', 124, true);


--
-- Name: medicamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicamentos_id_seq', 4, true);


--
-- Name: pacientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pacientes_id_seq', 34, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 18, true);


--
-- Name: alergias alergias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alergias
    ADD CONSTRAINT alergias_pkey PRIMARY KEY (id);


--
-- Name: cita_estados_historial cita_estados_historial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita_estados_historial
    ADD CONSTRAINT cita_estados_historial_pkey PRIMARY KEY (id);


--
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (id);


--
-- Name: consultorio_recursos consultorio_recursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorio_recursos
    ADD CONSTRAINT consultorio_recursos_pkey PRIMARY KEY (id);


--
-- Name: consultorios consultorios_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorios
    ADD CONSTRAINT consultorios_numero_key UNIQUE (numero);


--
-- Name: consultorios consultorios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorios
    ADD CONSTRAINT consultorios_pkey PRIMARY KEY (id);


--
-- Name: expediente_entradas expediente_entradas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente_entradas
    ADD CONSTRAINT expediente_entradas_pkey PRIMARY KEY (id);


--
-- Name: logs_auditoria logs_auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_pkey PRIMARY KEY (id);


--
-- Name: medicamentos medicamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamentos
    ADD CONSTRAINT medicamentos_pkey PRIMARY KEY (id);


--
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: idx_citas_consultorio; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_citas_consultorio ON public.citas USING btree (consultorio_id);


--
-- Name: idx_citas_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_citas_estado ON public.citas USING btree (estado);


--
-- Name: idx_citas_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_citas_fecha ON public.citas USING btree (fecha_programada);


--
-- Name: idx_citas_paciente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_citas_paciente ON public.citas USING btree (paciente_id);


--
-- Name: idx_consultorio_recursos_consultorio; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_consultorio_recursos_consultorio ON public.consultorio_recursos USING btree (consultorio_id);


--
-- Name: idx_expediente_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expediente_fecha ON public.expediente_entradas USING btree (fecha);


--
-- Name: idx_expediente_paciente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expediente_paciente ON public.expediente_entradas USING btree (paciente_id);


--
-- Name: idx_historial_cita; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_cita ON public.cita_estados_historial USING btree (cita_id);


--
-- Name: idx_usuarios_rol; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_rol ON public.usuarios USING btree (rol);


--
-- Name: idx_usuarios_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_username ON public.usuarios USING btree (username);


--
-- Name: ix_alergias_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_alergias_id ON public.alergias USING btree (id);


--
-- Name: ix_logs_auditoria_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_logs_auditoria_id ON public.logs_auditoria USING btree (id);


--
-- Name: ix_medicamentos_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_medicamentos_id ON public.medicamentos USING btree (id);


--
-- Name: uniq_slot_consultorio; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_slot_consultorio ON public.citas USING btree (consultorio_id, fecha_programada, hora_programada) WHERE (estado <> 'Cancelada'::public.estado_cita);


--
-- Name: consultorios_con_recursos _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.consultorios_con_recursos AS
 SELECT c.id,
    c.nombre,
    c.numero,
    c.piso,
    c.especialidad,
    c.medico,
    c.estado,
    c.capacidad,
    c.horario,
    c.ubicacion,
    c.notas,
    c.creado_en,
    c.actualizado_en,
    array_agg(r.recurso ORDER BY r.id) AS recursos
   FROM (public.consultorios c
     LEFT JOIN public.consultorio_recursos r ON ((r.consultorio_id = c.id)))
  GROUP BY c.id;


--
-- Name: alergias alergias_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alergias
    ADD CONSTRAINT alergias_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id) ON DELETE CASCADE;


--
-- Name: cita_estados_historial cita_estados_historial_cambiado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita_estados_historial
    ADD CONSTRAINT cita_estados_historial_cambiado_por_fkey FOREIGN KEY (cambiado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: cita_estados_historial cita_estados_historial_cita_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita_estados_historial
    ADD CONSTRAINT cita_estados_historial_cita_id_fkey FOREIGN KEY (cita_id) REFERENCES public.citas(id) ON DELETE CASCADE;


--
-- Name: citas citas_consultorio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id) ON DELETE RESTRICT;


--
-- Name: citas citas_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: citas citas_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id) ON DELETE RESTRICT;


--
-- Name: consultorio_recursos consultorio_recursos_consultorio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorio_recursos
    ADD CONSTRAINT consultorio_recursos_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id) ON DELETE CASCADE;


--
-- Name: expediente_entradas expediente_entradas_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente_entradas
    ADD CONSTRAINT expediente_entradas_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: expediente_entradas expediente_entradas_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente_entradas
    ADD CONSTRAINT expediente_entradas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id) ON DELETE RESTRICT;


--
-- Name: usuarios fk_usuarios_medico; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuarios_medico FOREIGN KEY (medico_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: logs_auditoria logs_auditoria_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: medicamentos medicamentos_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamentos
    ADD CONSTRAINT medicamentos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict v62cczTpTYCSuilJOxHzYeU5QNqhe1v2KKXdB7hQT6KYh6y9S8ffyVCkNGPygsq


import { TableColumnOptions } from 'typeorm';

export enum ENUM_TABLE_NAMES {
  GALLERY = 'gallery',

  GLOBAL_CONFIGS = 'global_configs',
  PERMISSIONS = 'permissions',
  PERMISSION_TYPES = 'permission_types',
  ROLES = 'roles',
  USERS = 'users',
  USER_ROLES = 'user_roles',
  ROLE_PERMISSIONS = 'role_permissions',

  // notification module tables
  SMS_GATEWAYS = 'sms_gateways',
  EMAIL_GATEWAYS = 'email_gateways',

  // common tables
  COUNTRIES = 'countries',
  CITIES = 'cities',
  TRAVEL_PURPOSES = 'travel_purposes',
  SKILLS = 'skills',
  LANGUAGES = 'languages',
  CURRENCIES = 'currencies',
  PROFESSIONS = 'professions',
  CERTIFICATIONS = 'certifications',

  JOB_DEMANDS = 'job_demands',
  JOB_DEMAND_SKILLS = 'job_demand_skills',
  JOB_DEMAND_VACANCIES = 'job_demand_vacancies',

  JOB_ROLES = 'job_roles',
  JOB_ELIGIBILITY_CRITERIAS = 'job_eligibility_criterias',
  JOB_ELIGIBILITY_REQUIREMENTS = 'job_eligibility_requirements',
  JOB_INDUSTRIES = 'job_industries',
  JOB_SECTORS = 'job_sectors',
  JOB_CATEGORIES = 'job_categories',
  JOB_CATEGORY_ROLES = 'job_category_roles',

  DYNAMIC_DROPDOWNS = 'dynamic_dropdowns',
  DYNAMIC_DROPDOWN_OPTIONS = 'dynamic_dropdown_options',

  ELIGIBILITY_CATEGORY = 'eligibility_category',
  ELIGIBILITY_SUBCATEGORY = 'eligibility_subcategory',

  COUNTRY_BENEFIT_CATEGORY = 'country_benefit_category',
  COUNTRY_BENEFIT_SUBCATEGORY = 'country_benefit_subcategory',

  // DESCISION ASSES MAP #ASSESMENT
  ASSESMENT_JOURNEYS = 'assessment_journeys',
  ASSESMENT_QUESTIONS = 'assessment_questions',
  ASSESMENT_ANSWERS = 'assessment_answers',
  ASSESMENT_QUESTION_OPTIONS = 'assessment_question_options',
  ASSESMENT_ANSWER_TYPES = 'assessment_answer_types',
  ASSESMENT_JOURNEY_QUESTIONS = 'assessment_journey_questions',
  ASSESMENT_JOURNEY_QUESTION_OPTIONS = 'assessment_journey_question_options',
  ASSESMENT_JOURNEY_QUESTION_OPTION_SUGGESTIONS = 'assessment_journey_question_option_suggestions',

  // DESCISION ASSES MAP #DECISION
  ASSESMENT_DECISIONS = 'assessment_decisions',
  ASSESMENT_DECISION_JOURNEYS = 'assessment_decision_journeys',
  ASSESMENT_DECISION_JOURNEY_QUESTIONS = 'assessment_decision_journey_questions',
  ASSESMENT_DECISION_JOURNEY_QUESTION_OPTIONS = 'assessment_decision_journey_question_options',
  ASSESMENT_DECISION_JOURNEY_QUESTION_OPTION_SUBMITS = 'assessment_decision_journey_question_option_submits',

  // worker module tables
  WORKER_PROFILES = 'worker_profiles',
  WORKER_PROFILE_LANGUAGES = 'worker_profile_languages',
  WORKER_PROFILE_EDUCATIONS = 'worker_profile_educations',
  WORKER_PROFILE_EXPERIENCES = 'worker_profile_experiences',
  WORKER_PROFILE_FAMILY_MEMBERS = 'worker_profile_family_members',
  WORKER_PROFILE_SKILLS = 'worker_profile_skills',
  WORKER_PROFILE_TRAININGS = 'worker_profile_trainings',
  WORKER_PROFILE_VISITED_COUNTRIES = 'worker_profile_visited_countries',
  WORKER_PROFILE_PREFERRED_COUNTRIES = 'worker_profile_preferred_countries',
  WORKER_PROFILE_PREFERRED_JOB_ROLES = 'worker_profile_preferred_job_roles',
  WORKER_PROFILE_LANGUAGE_PROFICIENCIES = 'worker_profile_language_proficiencies',
  WORKER_PROFILE_NID_INFORMATIONS = 'worker_profile_nid_informations',
  WORKER_PROFILE_PASSPORT_INFORMATIONS = 'worker_profile_passport_informations',
  WORKER_PROFILE_DOCUMENTS = 'worker_profile_documents',
  WORKER_PROFILE_GALLERIES = 'worker_profile_galleries',

  // provider module tables
  PROVIDERS = 'providers',
  PROVIDED_SERVICES = 'provided_services',
  COURSE_CATEGORIES = 'course_categories',
  COURSE_INSTRUCTORS = 'course_instructors',
  COURSES = 'courses',
  COURSE_FAQS = 'course_faqs',
  COURSE_CURRICULUMS = 'course_curriculums',
  COURSE_CURRICULUM_LESSONS = 'course_curriculum_lessons',
  COURSE_ENROLLMENTS = 'course_enrollments',

  // employer module tables
  EMPLOYER_PROFILES = 'employer_profiles',
  EMPLOYER_PROFILE_DOCUMENTS = 'employer_profile_documents',

  // employer module tables
  SUBSCRIPTION_PLANS = 'subscription_plans',
  SUBSCRIPTION_PLAN_BENEFITS = 'subscription_plan_benefits',
}

export enum ENUM_COLUMN_TYPES {
  PRIMARY_KEY = 'uuid',
  INT = 'int',
  FLOAT = 'float',
  TEXT = 'text',
  VARCHAR = 'varchar',
  BOOLEAN = 'boolean',
  DATE = 'date',
  TIMESTAMP_UTC = 'timestamp without time zone',
  ENUM = 'enum',
  JSONB = 'jsonb',
}

export const defaultDateTimeColumns: TableColumnOptions[] = [
  {
    name: 'createdAt',
    type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC,
    default: 'NOW()',
    isNullable: true,
  },
  {
    name: 'updatedAt',
    type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC,
    isNullable: true,
  },
];

export const defaultColumns: TableColumnOptions[] = [];

export const defaultPrimaryColumn: TableColumnOptions = {
  name: 'id',
  type: ENUM_COLUMN_TYPES.PRIMARY_KEY,
  isPrimary: true,
  generationStrategy: 'uuid',
  default: 'uuid_generate_v4()',
  isUnique: true,
};

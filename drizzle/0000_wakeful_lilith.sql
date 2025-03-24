CREATE TABLE "shadcn_themes" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"display_name" text,
	"theme_version" integer DEFAULT 1,
	"light_theme_colors" jsonb,
	"dark_theme_colors" jsonb,
	"fonts" jsonb,
	"radius" text,
	"space" text,
	"shadow" text,
	"icons" text,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE "theme_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" text,
	"theme_id" text
);
--> statement-breakpoint
CREATE TABLE "theme_palettes" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"theme_id" text,
	"mode" text,
	"text" text,
	"text_2" text,
	"text_3" text,
	"interface" text,
	"interface_2" text,
	"interface_3" text,
	"background" text,
	"background_2" text,
	"primary" text,
	"secondary" text,
	"accent" text,
	"accent_2" text,
	"accent_3" text
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" text,
	"name" text,
	"display_name" text,
	"is_public" boolean DEFAULT false,
	"category" text DEFAULT 'custom'
);
--> statement-breakpoint
CREATE TABLE "token_colors" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"theme_id" text,
	"plain" varchar(20),
	"classes" varchar(20),
	"interfaces" varchar(20),
	"structs" varchar(20),
	"enums" varchar(20),
	"keys" varchar(20),
	"methods" varchar(20),
	"functions" varchar(20),
	"variables" varchar(20),
	"variables_other" varchar(20),
	"global_variables" varchar(20),
	"local_variables" varchar(20),
	"parameters" varchar(20),
	"properties" varchar(20),
	"strings" varchar(20),
	"string_escape_sequences" varchar(20),
	"keywords" varchar(20),
	"keywords_control" varchar(20),
	"storage_modifiers" varchar(20),
	"comments" varchar(20),
	"doc_comments" varchar(20),
	"numbers" varchar(20),
	"booleans" varchar(20),
	"operators" varchar(20),
	"macros" varchar(20),
	"preprocessor" varchar(20),
	"urls" varchar(20),
	"tags" varchar(20),
	"jsx_tags" varchar(20),
	"attributes" varchar(20),
	"types" varchar(20),
	"constants" varchar(20),
	"labels" varchar(20),
	"namespaces" varchar(20),
	"modules" varchar(20),
	"type_parameters" varchar(20),
	"exceptions" varchar(20),
	"decorators" varchar(20),
	"calls" varchar(20),
	"punctuation" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"username" text,
	"image_url" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "shadcn_themes" ADD CONSTRAINT "shadcn_themes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_likes" ADD CONSTRAINT "theme_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_likes" ADD CONSTRAINT "theme_likes_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_palettes" ADD CONSTRAINT "theme_palettes_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "themes" ADD CONSTRAINT "themes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_colors" ADD CONSTRAINT "token_colors_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE no action ON UPDATE no action;
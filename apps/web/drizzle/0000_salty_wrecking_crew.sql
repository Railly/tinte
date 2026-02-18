CREATE TABLE "theme" (
	"id" text PRIMARY KEY NOT NULL,
	"legacy_id" text NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"light_bg" text NOT NULL,
	"light_bg_2" text NOT NULL,
	"light_ui" text NOT NULL,
	"light_ui_2" text NOT NULL,
	"light_ui_3" text NOT NULL,
	"light_tx" text NOT NULL,
	"light_tx_2" text NOT NULL,
	"light_tx_3" text NOT NULL,
	"light_pr" text NOT NULL,
	"light_sc" text NOT NULL,
	"light_ac_1" text NOT NULL,
	"light_ac_2" text NOT NULL,
	"light_ac_3" text NOT NULL,
	"dark_bg" text NOT NULL,
	"dark_bg_2" text NOT NULL,
	"dark_ui" text NOT NULL,
	"dark_ui_2" text NOT NULL,
	"dark_ui_3" text NOT NULL,
	"dark_tx" text NOT NULL,
	"dark_tx_2" text NOT NULL,
	"dark_tx_3" text NOT NULL,
	"dark_pr" text NOT NULL,
	"dark_sc" text NOT NULL,
	"dark_ac_1" text NOT NULL,
	"dark_ac_2" text NOT NULL,
	"dark_ac_3" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"shadcn_override" jsonb,
	"vscode_override" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "theme_legacy_id_unique" UNIQUE("legacy_id"),
	CONSTRAINT "theme_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"email_verified" boolean DEFAULT false,
	"image" text,
	"clerk_id" text,
	"username" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "theme" ADD CONSTRAINT "theme_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
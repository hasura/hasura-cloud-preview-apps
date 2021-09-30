CREATE TABLE "public"."article" ("id" serial NOT NULL, "title" text NOT NULL, "content" text NOT NULL, "author_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("author_id") REFERENCES "public"."author"("id") ON UPDATE restrict ON DELETE restrict);

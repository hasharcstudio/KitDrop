import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    // Email/Password via Supabase Auth
    CredentialsProvider({
      name: "KitDrop Account",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "member@kitdrop.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Admin login logic mapped specifically
        if (
          credentials.email === "admin@kitdrop.com" &&
          credentials.password === "admin123"
        ) {
          return {
            id: "admin-001",
            name: "Admin",
            email: "admin@kitdrop.com",
            role: "admin",
          };
        }

        // Authenticate standard users against Supabase Auth
        const { getSupabaseAdmin } = await import("@/lib/supabase");
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          console.error("Auth error:", error?.message);
          return null; // Invalid credentials
        }

        return {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || "KitDrop Member",
          email: data.user.email,
          role: "user",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    async signIn({ user, account }) {
      // For social logins, ensure the user exists in the customers table
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          const { getSupabaseAdmin } = await import("@/lib/supabase");
          const supabase = getSupabaseAdmin();
          
          // Check if customer already exists
          const { data: existing } = await supabase
            .from("customers")
            .select("id")
            .eq("email", user.email)
            .single();

          // If not, create a new customer record
          if (!existing) {
            await supabase.from("customers").insert({
              email: user.email,
              full_name: user.name || "KitDrop Member",
              payment_method: "Cash on Delivery",
            });
          }
        } catch (err) {
          console.error("Social login customer sync error:", err);
          // Don't block login on sync failure
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as { role?: string }).role || "user";
      }
      // Set role for social logins
      if (account?.provider === "google" || account?.provider === "facebook") {
        // Check if this social user is the admin
        if (token.email === "admin@kitdrop.com") {
          token.role = "admin";
        } else {
          token.role = "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error Extending NextAuth session user type inline for prototype
        session.user.id = token.sub;
        // @ts-expect-error Adding role to session
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "mock-secret-kitdrop-prototype-only",
});

export { handler as GET, handler as POST };

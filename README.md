# Rwanda Plastic Industries — Setup & Deployment

This is a real, working React app connected to a live Supabase backend
(database + authentication + security rules already created for you).

## 1. Run it locally first (to check everything works)

You'll need Node.js installed (nodejs.org — get the LTS version).

```
cd rpi-app
npm install
npm run dev
```

Open the URL it gives you (usually http://localhost:5173). Try:
- Browsing products (real data from your database)
- Signing up as a new customer
- Submitting a quote request
- Logging in

## 2. Deploy to Netlify

Same as your other site (KeSphere Digital):
1. Push this folder to a GitHub repo (or drag-and-drop the built `dist` folder
   after running `npm run build`, if you don't want to use Git)
2. In Netlify: New site from Git → pick the repo
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Environment variables** — in Netlify's site settings, add:
   - `VITE_SUPABASE_URL` = `https://djhypupmnfngztifvccp.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (the anon key you gave me — same one in `.env`)
   (The `.env` file works for local dev; Netlify needs its own copy of these
   two values in its dashboard to build correctly.)
5. Deploy.

## 3. Give yourself staff/admin access

New signups are always created as **customers** — this is intentional
(so a random visitor can't just sign up and get into the admin dashboard).

To make your own account staff or admin:
1. Sign up normally on the live site with your own email
2. Go to your Supabase dashboard → Table Editor → `profiles` table
3. Find your row (matched by email) → change the `role` column from
   `customer` to `admin` (or `staff`)
4. Log out and back in on the site — you'll now see the admin dashboard

## 4. What's real vs. what's still ahead

**Working now:**
- Real signup/login (Supabase Auth, hashed passwords, sessions)
- Real database — products, quotations, orders, inventory, customers
- Role-based access enforced at the database level (Row Level Security) —
  customers genuinely cannot query other customers' or staff data, even by
  tampering with the app
- Full quote → staff pricing → accept → order → status tracking flow, all persisted

**Still needs real provider accounts to go live** (I can wire these in once you have them):
- Mobile Money payments (MTN MoMo / Airtel Money developer accounts)
- SMS notifications (e.g. Africa's Talking)
- WhatsApp Business API notifications
- Invoice PDF generation and download
- File uploads for custom-order reference images (needs Supabase Storage bucket set up)

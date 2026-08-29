# Local Offer Page Setup

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=419d83f8-4919-482a-a235-a29241310e9e
Updated: 2026-07-17T14:19:18.087Z

Full details will be entered

## **Assign API Offer Title**
The API offer title is a case sensitive value that serves two purposes:

- Its the name of the offer.  It shows up in AF dashboard and on the LLP page banners
- Its a string in the Promotions API, its used as a lookup value to map available local offers per location.
It is not best practice to use a value in this way however, Anytime Fitness required it to be setup as such.  Because it serves as a UI element and API string - its require careful consideration since the Purpose brands product and marketing teams sometimes send us Offer names and titles that won't work as the API offer title.

**Step 1: Ensure API Offer title is proper**

When receiving a ticket, look for the "Offer Title" provided by Purposebrands product teams.  Then assess if the Offer Title can be used as the "API Offer Title".  There are a few key considerations:

- The offer title can't be longer than roughly 8 words.  If it is, convert it to shorter value.
- The offer title should be in the language of the locale
- The offer title should be associated to the actual deal the person is receiving.  
- Example ->  "Flash Sale" is too generic and doesn't indicate the deal " Join for $1"  
- Example -> "Purple Day" is temporary so we shouldn't tie and API offer title to temporary name (example "Join now and get rest of year free" instead of "Purple Day")
Within the page itself, you might still be able to use the offer title they originally provided to you - however the API offer title must follow these rules.  

- Offer name -> name of the offer shown on the web page
- Offer Title -> A more specific name, usually indicates the API offer title.
**REMINDER:** Remove any trailing spaces after the offer title, this will accidentally break the API lookup logic.

## **Assign URL Slug**
If the page URL slug is not provided, please refer to the Offer Title to build the slug. This process applies to local offers, group offers, and member offers.  The process is as follows:

**Step 1:** Locate the correct Offer title

Do not use the Name of the promotion unless it is the same as the Offer Title. **Why?** The promotion name is often a temporary value that might not be used for an extended period.  We want to make the URL slug re-useable if future offers are using that slug.   

**For example) **If you received a local offer with a catchy promotional name like "May birthday campaign" but the actual offer that the user gets is Join and Get 2 Months Free - use the more specific offer title.

- Offer name -> February 2026 Day Zero Campaign -> ❌ **Avoid this - do not use for slug. Its specific to a day and its a temporary "Day Zero Campaign" that may never come back again.**
- Offer title or implied offer -> Join and Get 2 Months Free -> ✅ **Use this for the URL slug, it could be a future offer and we won't have to keep recreating the URL.**
**Step 1.1) **If offer title is not in english, convert the URL slug to english.

If the local offer is for a country that doesn't use english, locating the offer title might require you to copy paste the ticket into Chat GPT or an AI translator.  Once converted to english, you can verify more accurately what the offer title is or implied hard offer.

- In the screenshot below - the developer is able to translate an italian local offer request and find that the name is "Flash Sale" but the actual offer is ISCRIVITI CON 1 EURO, IL PROSSIMO MESE È GRATUITO. 
- 
- Converted - we can see "Join for 1, next month is free" is much better slug URL than just "Flash Sale"
- 
- Then if we changed this to a slug it could be /join-for-1-next-month-free
**DO NOT CHANGE THE API OFFER TITLE - KEEP THAT IN THE COUNTRIES LANGUAGE.  THIS ONLY APPLIES TO URL SLUG. ****Step 2: Convert Offer Title to a Page URL slug**

- The slug should also remove conjunctions 
- lower case
- remove special characters and accents
**For example) **The offer title is Join and Get 2 Months Free so the correct slug is `/join-get-2-months-free`

Also ensure that you are properly apply the locale to the slug.  

**Step 2.1) URL Slug conflicts with Primary locale**

In these cases put the locale's country iso code at the end.  
- E.g., Canada put -enca

**Step 3: **Enter the example URL into the [Global Pixel Catalog](https://docs.google.com/spreadsheets/d/1uUfK7vMlnPJOSMK1VKPw0V_yJrfKA2pX/edit?gid=977035100#gid=977035100)

- The first tab holds all the local offers
- Ensure there is an entry already for the offer you are creating
- Type the URL in this format: https://www.anytimefitness.com/offer/local/join-get-2-months-free/?location_id={location_id}
- Add the locale if its for a country other than the USA.  **Do not miss this step.**
- e.g.,) **/en-au/**offer/local/join-get-2-months-free/?location_id={location_id}1
**
Assign H2 Heading Override (optional)**

This field replaces the default H2 heading on the local offer page. Leave it empty to use the default text.

**

To insert the location name into your custom title, use one of these placeholders, written in round brackets:

- `(CITY)`
- `(GYM NAME)`
- `(LOCATION)`
All three are replaced with the location's name. Round brackets are required; curly brackets `{CITY}` or square brackets `[CITY]` will not work.

- Example input: `Erlebe jetzt deinen AF Club (CITY)`
- Rendered output: `Erlebe jetzt deinen AF Club Wels` (the location name)
**

For non-English locales, write the custom title in the locale's language but keep the placeholder in English as shown above.

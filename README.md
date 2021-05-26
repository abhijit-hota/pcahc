## Stuff Used
- [Next.js](https://nextjs.org/) 
- Firebase RTDB
- Chakra UI

## Pending
- **Unique name validation**: Users can join with the same name. Doesn't affect the functionality but would create confusion.
- **Unique cards validation**: Users can be assigned same white cards.
  - **Plan**: Check during room joining 
- Handling more packs
  - Only has the **CAH base pack** for now which is loaded from the `json` files in `public` folder and is sent to every client
  - Choosing (During room creation?)
  - Downloading/**Fetching from a DB** 
- Handling more "picks". 
  - Doesn't work for more than one pick. You should go ahead with playing.
- RTDB Security Rules
  - **Plan**: Make `/api` routes and update only from those routes. Restrict all update functionality to admin user in firebase if that's a thing.
- Choose a better license?
  - CAH wants us to include the same license. But this license is not recommended for software. Hope I don't get into trouble.

## LICENCSE

Shield: [![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

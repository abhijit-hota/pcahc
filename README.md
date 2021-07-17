## Stuff Used
- [Next.js](https://nextjs.org/) 
- Firebase RTDB
- Chakra UI

## Pending
- **Unique name validation**: Users can join with the same name. Doesn't affect the functionality but would create confusion.
- **Unique cards validation**: Users can be assigned same white cards.
  - **Plan**: Check during room joining 
- Handling more packs
  - Only has the **CAH base pack** for now which is loaded from the `json` files in `public/data` folder and is sent to every client
  - Choosing (During room creation?)
  - Downloading/**Fetching from a DB** 
- Handling more "picks". 
  - Doesn't work for more than one pick. You should go ahead with playing.

## LICENSE

### Code
[![MIT][mit-shield]]("/LICENSE")

All the work except for the data in the [`public/data`](/public/data) folder is licensed under a [MIT License](/LICENSE)

### Card data
All the data shown in cards is obtained from [here](https://crhallberg.com/cah/) and is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa]. 


[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

“Cards Against Humanity” is the trademark of [Cards Against Humanity, LLC](https://cardsagainsthumanity.com/).

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg
[mit-shield]: https://img.shields.io/badge/License-MIT-lightgrey.svg

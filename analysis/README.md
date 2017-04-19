# Pulse data analysis

To begin data analysis:

## Setup

1. Download the [latest data dump](https://sql.telemetry.mozilla.org/api/queries/4724/results/1990812.csv)
   from re:dash.
2. Move that file into this directory, renamed `data.csv`.
3. Install Python 3.6 and create a [virtualenv](https://github.com/brainsik/virtualenv-burrito) with it.
4. Activate that virtualenv.
5. Install the dependencies using pip: `pip install -r requirements.txt`

## Running the tests

Tests are broken into their own Python files

After setting up your environment, the data in the CSV can be analyzed from the
`analysis` directory by simply running `python filename.py`. The available tests
are:

- `browser.py` - compares sentiment ratings with browser state metrics, such as
  the number of open tabs and windows.
- `timers.py` - compares sentiment ratings with page timers: to `window.onLoad`,
  `DOMContentLoaded`, first user interaction, and first paint.

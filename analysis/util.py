from scipy.stats.mstats import kruskalwallis

from csv import DictReader

CSV = './data.csv'
P = 0.05
NPS = {
    '1': 'detractor',
    '2': 'detractor',
    '3': 'detractor',
    '5': 'promoter'
}

def csv(path):
    return open(path, 'r')

def csv_reader():
    return DictReader(csv(CSV))

def row_sentiment_and(row, *args):
    keys = ['sentiment'] + list(args)
    return {k: row[k] for k in keys}

def sentiment_and(*args):
    csv = csv_reader()
    rows = []
    for row in csv:
        rows.append(row_sentiment_and(row, *args))
    return rows

def group_by_sentiment(field, coerce):
    rows = sentiment_and(field)
    grouped = {}
    for row in rows:
        sentiment = row['sentiment']
        if sentiment not in grouped:
            grouped[sentiment] = []
        try:
            grouped[row['sentiment']].append(coerce(row[field]) if coerce
                else row[field])
        except ValueError:
            pass
    return grouped

def group_by_nps(field, coerce):
    rows = sentiment_and(field)
    grouped = {}
    for row in rows:
        if row['sentiment'] in NPS:
            sentiment = NPS[row['sentiment']]
            if sentiment not in grouped:
                grouped[sentiment] = []
            try:
                grouped[sentiment].append(coerce(row[field]) if coerce
                    else row[field])
            except ValueError:
                pass
    return grouped

def singificant(p_value):
    if p_value < P:
        return 'Is statistically significant'
    return 'Is not statistically significant'

def kruskal_wallis(field, coerce=None):
    h1, p1 = kruskalwallis(*group_by_sentiment(field, coerce).values())
    h2, p2 = kruskalwallis(*group_by_nps(field, coerce).values())
    print('\nKruskal-Wallis H-Test on %s:' % field)
    print('  - When grouped by ordinal value:')
    print('    - %s' % singificant(p1))
    print('    - H = %s' % h1)
    print('    - p = %s' % p1)
    print('  - When grouped by Net Promoter Score:')
    print('    - %s' % singificant(p2))
    print('    - H = %s' % h2)
    print('    - p = %s' % p2)

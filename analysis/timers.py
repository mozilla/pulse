from util import kruskal_wallis

if __name__ == '__main__':
    kruskal_wallis('timercontentloaded', int)
    kruskal_wallis('timerwindowload', int)
    kruskal_wallis('timerfirstinteraction', int)
    kruskal_wallis('timerfirstpaint', int)

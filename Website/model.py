import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC #building the model
from joblib import load
clf = load('model.joblib')

import sys, json
lines = sys.argv
data = json.loads(lines[1])

#proba = clf.predict([data])
#print(proba[0])
proba = clf.predict_proba([data])
print(proba[0][1])
import pandas as pd
election=pd.read_csv("trainingData1.csv")
#print election.head()
feature_cols=['F1','F2','F3','F4','F5','F6','F7','F8']
x=election[feature_cols] #feature
y=election.Outcome #target

from sklearn.model_selection import train_test_split
x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=0.05,random_state=0) #splitting for training and testing


from sklearn.svm import SVC #building the model
clf=SVC(kernel='poly',C=10,gamma=0.01,random_state=0,probability=True)
clf.fit(x_train,y_train)
pred=clf.predict(x_test)

#confusion matrix for evaluating performance and visualizing
from sklearn import metrics
#matrix=metrics.confusion_matrix(y_test,pred)
#print matrix #if we add at least 1 more set of data, we can remove the comment

#evaluation metrics
print("Accuracy: ",metrics.accuracy_score(y_test,pred)) #these three metrics are important!
print("Precision: ",metrics.precision_score(y_test,pred))
print("Recall: ",metrics.recall_score(y_test,pred))

from joblib import dump
dump(clf, 'Website/model.joblib')
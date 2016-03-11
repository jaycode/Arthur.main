FROM tensorflow/tensorflow:latest
RUN apt-get -y update

# Update according to requirements.txt
RUN pip install -U scikit-learn flask tornado pymongo flask-pymongo \
  pdfminer progressbar itsdangerous sockjs-tornado>=1.0.2 redis>=2.10.5 \
  pycket>=0.3.0
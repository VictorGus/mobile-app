FROM openjdk:11-jre
ENV PGPORT     = 5443
ENV PGHOST     = ec2-3-9-239-1.eu-west-2.compute.amazonaws.com
ENV PGUSER     = postgres
ENV PGDATABASE = mobiledb
ENV PGPASSWORD = postgres
ENV PGIMAGE    = postgres:latest

ADD app.jar /app.jar

CMD java -XX:-OmitStackTraceInFastThrow \
  -Dcom.sun.management.jmxremote \
  -Dcom.sun.management.jmxremote.host=127.0.0.1 \
  -Djava.rmi.server.hostname=127.0.0.1 \
  -Dcom.sun.management.jmxremote.port=9099 \
  -Dcom.sun.management.jmxremote.authenticate=false \
  -Dcom.sun.management.jmxremote.ssl=false\
  -jar /app.jar -m app.core
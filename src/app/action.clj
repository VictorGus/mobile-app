(ns app.action
  (:require
   [app.manifest  :as manifest]
   [honeysql.core :as hsql]
   [app.dbcore    :as db]))

(defn get-upcoming-notifications [ctx]
  (fn [{:keys [params] :as request}]
    (let [res (db/query {:select [:*]
                         :from [[:notification :n]]
                         :where [:and
                                 (hsql/raw "(select id from notification_result where notification_id = n.id) is null")
                                 [:>= :date_time (java.sql.Timestamp/valueOf (-> (:date_from params)
                                                                                 (clojure.string/replace "T" " ")
                                                                                 (clojure.string/replace "Z" "")))]
                                 [:<= :date_time (java.sql.Timestamp/valueOf (-> (:date_to params)
                                                                                 (clojure.string/replace "T" " ")
                                                                                 (clojure.string/replace "Z" "")))]]}
                        ctx)]
      {:status 200
       :body {:entry res}})))

(defn get-notification-results-ratio [ctx]
  (fn [{:keys [params] :as request}]
    (let [res (db/query {:select [(hsql/raw "count(*), n_result")]
                         :from [:notification_result]
                         :group-by [:n-result]} ctx)]
      {:status 200
       :body {:entry res}})))

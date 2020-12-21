(ns app.crud
  (:require
   [app.manifest :as manifest]
   [honeysql.core :as hsql]
   [app.dbcore   :as db]))

(def entities-structure
  {:notification        {:fields {:id                   {:type "string"}
                                  :user_id              {:type "string"}
                                  :n_action             {:type "string"}
                                  :category             {:type "string"
                                                         :value-set ["water" "walking" "pills" "nutrition-order"
                                                                     "medical-service" "activities"]}
                                  :notification_rate    {:type "integer"}
                                  :date_time            {:type "date-time"}}
                         :search-params [:id :date_from :date_to :user_id :category]}

   :notification_result {:fields {:id                   {:type "string"}
                                  :notification_id      {:type "string"}
                                  :category             {:type "string"
                                                         :value-set ["water" "walking" "pills" "nutrition-order"
                                                                     "medical-service" "activities"]}
                                  :date_time            {:type "date-time"}
                                  :n_result             {:type "string"
                                                         :value-set ["rejected"
                                                                     "performed"
                                                                     "unprocessed"]}}
                         :search-params [:id :date_from :date_to :user_id :category]}

   :settings            {:fields {:id                   {:type "string"}
                                  :user_id              {:type "string"}
                                  :enable_achievements  {:type "boolean"}
                                  :enable_notifications {:type "boolean"}
                                  :enable_md_sync       {:type "boolean"}
                                  :sync_rate            {:type "integer"}}
                         :search-params [:id :user_id]}

   :public_user         {:fields {:id                   {:type "text"}
                                  :device_id            {:type "text"}}
                         :search-params [:id :device_id]}

   :achievement {}
   })

(defn normalize-fields [body entity]
  (reduce-kv
   (fn [acc k v]
     (let [{:keys [type]} (get-in entities-structure [entity :fields k])]
       (assoc acc k (when v
                      (case type
                        "boolean"
                        (boolean (Boolean/valueOf v))
                        "date-time"
                        (java.sql.Timestamp/valueOf v)
                        "integer"
                        (cond-> v
                            (instance? java.lang.String v)
                            Integer/parseInt)
                        v)))))
   {}
   body))

(defn update-entity [ctx entity]
  (fn [{{:keys [id]} :params
       body          :body :as request}]
    (let [body   (clojure.walk/keywordize-keys body)
          values (normalize-fields body entity)
          result (db/execute {:update entity
                              :set values
                              :where [:= :id id]} ctx)]
      (if (= result 1)
        {:status 200
         :body body}
        {:status 404
         :body {:message (str "Resource with id " id " is not found")}}))))

(defn create-entity [ctx entity]
  (fn [{:keys [body] :as request}]
    (let [body (as-> (clojure.walk/keywordize-keys body) body
                 (cond-> body
                   (not (:id body))
                   (assoc :id (str (java.util.UUID/randomUUID)))))
          values (normalize-fields body entity)]
      (db/execute {:insert-into entity
                   :values [values]} ctx)
      {:status 201
       :body body})))


(defn patch-entity [ctx entity]
  (fn [{{:keys [id]} :params
        body         :body :as request}]
    (let [body     (clojure.walk/keywordize-keys body)
          resource (merge (db/query-first {:select [:*]
                                           :from [entity]
                                           :where [:= :id id]} ctx) body)
          values (normalize-fields resource entity)
          result (db/execute {:update entity
                              :set values
                              :where [:= id :id]} ctx)]
      (if (= result 1)
        {:status 200
         :body resource}
        {:status 404
         :body {:message (str "Resource with id " id " is not found")}}))))


(defn delete-entity [ctx entity]
  (fn [{{:keys [id]} :params :as request}]
    (let [result (db/execute {:delete-from entity
                              :where [:= :id id]} ctx)]
      (if (= result 1)
        {:status 200
         :body {:message "ok"}}
        {:status 404
         :body {:message (str "Resource with id " id " is not found")}}))))

(defn read-entity [ctx entity]
  (fn [{:keys [params] :as request}]
    (let [invalid-params (filter #(not ((set (:search-params (entity entities-structure))) %))
                                 (keys params))]
      (if (empty? invalid-params)
        (let [query (cond-> {:select [:*]
                             :from [entity]}

                      (not-empty params)
                      (assoc :where
                             (cond-> [:and]

                               (:date_from params)
                               (conj [:>= :date_time (java.sql.Timestamp/valueOf (-> (:date_from params)
                                                                                     (clojure.string/replace "T" " ")
                                                                                     (clojure.string/replace "Z" "")))])

                               (:date_to params)
                               (conj [:<= :date_time (java.sql.Timestamp/valueOf (-> (:date_to params)
                                                                                         (clojure.string/replace "T" " ")
                                                                                         (clojure.string/replace "Z" "")))])

                               (:user_id params)
                               (conj [:= :user_id (:user_id params)])

                               (:category params)
                               (conj [:= :category (:category params)])

                               (:device_id params)
                               (conj [:= :device_id (:device_id params)]))))
              data (if-let [id (:id params)]
                     (db/query-first {:select [:*]
                                      :from [entity]
                                      :where [:= :id id]} ctx)
                     (db/query query ctx))]
          (if data
            {:status 200
             :body {:entry data}}
            {:status 404
             :body {:message (str "Resource with id " (:id params) " is not found")}}))
        {:status 404
         :body {:message (str "Unknown params " (clojure.string/join ", " invalid-params))}}))))

(comment


  (hsql/raw (java.sql.Timestamp/valueOf (-> "2020-12-03T15:58:00Z"
                                            (clojure.string/replace "T" " ")
                                            (clojure.string/replace "Z" ""))) )

  )

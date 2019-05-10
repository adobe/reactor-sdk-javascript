Changes in the Launch API just before v1.0
========================================================================

DELETE getRuleForRuleComponent
                                              GET    /rule_components/:rule_component_id/rule(.:format)                           v1/default_related#show {:type=>"rule_component", :related_type=>"rule"}
ADD listRulesForRuleComponent
                                              GET    /rule_components/:rule_component_id/rules(.:format)                          v1/default_related#show {:type=>"rule_component", :related_type=>"rules"}

ADD listRuleRelationshipsForRuleComponent
                                              GET    /rule_components/:rule_component_id/relationships/rule(.:format)             v1/default_related#show {:type=>"rule_component", :related_type=>"rule"}


DEPRECATE createRuleComponent (the old version)
                                              POST   /rules/:rule_id/rule_components(.:format)                                    v1/rule_components#create
by renaming to deprecatedCreateRuleComponent
                                              POST   /rules/:rule_id/rule_components(.:format)                                    v1/rule_components#deprecated_create
ADD createRuleComponent (the new version)
                                              POST   /properties/:property_id/rule_components(.:format)                           v1/rule_components#create


ADD listDataElementsForLibrary
                                              GET    /libraries/:library_id/relationships/data_elements(.:format)                 v1/libraries_relationships_data_elements#show
ADD replaceDataElementRelationshipsForLibrary
                                              PATCH  /libraries/:library_id/relationships/data_elements(.:format)                 v1/libraries_relationships_data_elements#update
ignore PUT
                                              PUT    /libraries/:library_id/relationships/data_elements(.:format)                 v1/libraries_relationships_data_elements#update
ADD removeRuleRelationshipsFromLibrary
                                              DELETE /libraries/:library_id/relationships/data_elements(.:format)                 v1/libraries_relationships_data_elements#destroy
ADD addDataElementRelationshipsToLibrary
                                              POST   /libraries/:library_id/relationships/data_elements(.:format)                 v1/libraries_relationships_data_elements#create
ADD listExtensionRelationshipsForLibrary
                                              GET    /libraries/:library_id/relationships/extensions(.:format)                    v1/libraries_relationships_extensions#show
ADD replaceExtensionRelationshipsForLibrary
                                              PATCH  /libraries/:library_id/relationships/extensions(.:format)                    v1/libraries_relationships_extensions#update
ignore PUT
                                              PUT    /libraries/:library_id/relationships/extensions(.:format)                    v1/libraries_relationships_extensions#update
ADD removeExtensionRelationshipsFromLibrary
                                              DELETE /libraries/:library_id/relationships/extensions(.:format)                    v1/libraries_relationships_extensions#destroy
ADD addExtensionRelationshipsToLibrary
                                              POST   /libraries/:library_id/relationships/extensions(.:format)                    v1/libraries_relationships_extensions#create
ADD listRuleRelationshipsForLibrary
                                              GET    /libraries/:library_id/relationships/rules(.:format)                         v1/libraries_relationships_rules#show
ADD replaceRuleRelationshipsForLibrary
                                              PATCH  /libraries/:library_id/relationships/rules(.:format)                         v1/libraries_relationships_rules#update
ignore PUT
                                              PUT    /libraries/:library_id/relationships/rules(.:format)                         v1/libraries_relationships_rules#update
ADD removeRuleRelationshipsFromLibrary
                                              DELETE /libraries/:library_id/relationships/rules(.:format)                         v1/libraries_relationships_rules#destroy
ADD addRuleRelationshipsToLibrary
                                              POST   /libraries/:library_id/relationships/rules(.:format)                         v1/libraries_relationships_rules#create
ADD listDataElementsForLibrary
                                              GET    /libraries/:library_id/data_elements(.:format)                               v1/default_related#index {:type=>"library", :related_type=>"data_elements"}
ADD listExtensionsForLibrary
                                              GET    /libraries/:library_id/extensions(.:format)                                  v1/default_related#index {:type=>"library", :related_type=>"extensions"}
ADD listRulesForLibrary
                                              GET    /libraries/:library_id/rules(.:format)                                       v1/default_related#index {:type=>"library", :related_type=>"rules"}


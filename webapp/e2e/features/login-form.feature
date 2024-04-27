Feature: Login a registered user

Scenario: The user is registered in the site
  Given An registered user
  When I fill the data in the form to log in
  Then is taken to the home page
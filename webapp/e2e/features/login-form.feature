Feature: Login a registered user

Scenario: The user is registered in the site
  Given An registered user
  When I fill the data in the form to log in
  Then is taken to the home page

Scenario: User logs in with invalid credentials
  Given a registered user with username "testUser" and password "testpass"
  When I fill the login form with username "testUser" and incorrect password "wrongpass"
  And I remain on the login page

Scenario: User attempts to login without entering credentials
  Given a registered user with username "testUser" and password "testpass"
  When I attempt to log in without entering any credentials
  And I remain on the login page
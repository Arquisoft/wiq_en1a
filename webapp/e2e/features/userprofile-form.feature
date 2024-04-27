Feature: View and Change User Quiz Rankings

Scenario: Viewing Global Rankings
  Given the user navigates to their profile
  When they select the "Global" category
  Then they see their performance statistics for global quizzes

Scenario: Switching Category to Flags
  Given the user is on their profile page
  When they click on the "Flags" category
  Then they view their performance metrics for flag-related quizzes

Scenario: Switching Category to Food
  Given the user is on their profile page
  When they click on the "Food" category
  Then they view their performance metrics for food-related quizzes


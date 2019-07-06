Feature: I am going to validate Calculator App

@calculatortesting
Scenario: Calculator Add functionality testing

Given I will navigate to Calc Site
When I add two numbers "3" and "5"
Then the output displayed should be "7"

@calculatortesting
Scenario: Calculator Add functionality testing no 2

Given I will navigate to "calc" page
When I add two numbers "2" and "7"
Then the output displayed should be "9"
@AngularTesting
Scenario Outline:  Angualar validations

Given I will navigate to "AngularJs" page
When I clicked on header link
And you will navigate to angular page
Then you will enter "<key>" in search box

Examples:
| key | 
| hello |
| hey   |









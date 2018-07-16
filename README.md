# BBDN-BBQL

A concept approach for using GraphQL queries against Blackboard Learn's REST API.

## The current state of Learn's RESTful API structure.

Blackboard has a rich API that can be utilized by developers to make modern 'User Friendly' applications for end user experiences (UX). From obtaining Users, Courses, Course Memberships to Data Sources, Announcements, etc. Learn's REST API's offer a lot flexible methods in gathering data for end user applications.

With that being said there is an underlying complex nature to these API's that cause certain requests hard to manage for a developer. Certain API's do not pre-populate the referenced data: Membership (until release 3400.7), the membership object only contained the userId field but not the acutal user data. Child Courses (Merged Courses), again, the actual base and child course information is not supplied to the end user. Developers have to manage this in their applications by a set of complex logic to help track each record state. This can be very overwhelming, cumbersome, and extraneous that can be unecessary in application development. 

For instance, the problem at hand, if a request is made to a course where the externalId is only known the end user, we make the course to get the rest of the information:

```
/courses/externalId:<courseId>
```

The result returns the course object with all the information about the object. Now the end user wants to request to view the course memberships:

```
/courses/externalId:<courseId>/users
```

The result is return but with only the courseId, userId, courseRoleId, etc. But not that readable information to the end user. Who is this userId (_x_1)? Note: In a recent release for the Learn API, the memberships now return the user object. If now the end user will have to make another request to get the user information:

```
/users/<userId>
(/users/_x_1)
```

Now this isn't so bad for one user. Two requests and you have the course memberships and one user object. But, normally a courses is enrolled with several more. In this particular test case, 30 will be our number of enrollments.

Scenario, a developer created an application to allow on system admistrative users to have access to check on course enrollments; Student Advisors. Now these advisors may not have full access to an internal SIS (Student Information System) but were given access to this web application for the interm. Students are complaining that they cannot see their course in Blackboard. Now this advisor wants to ensure that the enrollments for this course is in Blackboard. The advisor only has the course id known to the students; externalId:ENC1101-123456. So the advisor requests the course information; first request. The course is open, so the advisor checks the enrollments; second request. The advisor is given and list of users only by their userIds. These ids are Learn's primary key; _x_1. So in order for the advisor ensure that all the students who are having issues are indeed enrolled, they must not request all the users one by one; 30 requests. This results in a total of 32 requests to obtain what 1 request should done. 

Now let's say there was a problem, these enrollments were done via a different data source key and that has now been decomissioned for some reason. The advisor now needs to peek at the data sources for the users, possibly the course too. Now there will be more subsequent calls to the REST API. Keep in mind the concept of data caching for these objects might be the first occurence.

Now Learn's API, as rich as they are, are not fully flexible in the backend. As third developers are met these complexities, so is Blackboard at a larger scale.

## Enter GraphQL!

### Why GraphQL?

GraphQL is a library and concept development by Facebook in order to help solve a problem known as n+1. This problem is essentially where you make several calls to a data source where only a few maybe acually necessary. The problem arose when the Facebook app was trying to load a users friends, then wanted to get their friends, then more friends, ... etc. This resulted in a very slow result returning to the end user. The application had to do multiple calls to gather all this information. Keep in mind that some friends may be friends with the same people. This is resulting in uncessary calls. 

GraphQL was the starting point for this solution by allowing a developer to craft queries to a single endpoint and get the exact data they requested. Emliminating a lot complex filtering on the end user and let the server do the heavy lifting. 


### But wait, this isn't acutally the n+1 problem, that's a API issue

As stated GraphQL is to make is easier to developers to craft queries to obtain the actual data they are requesting, Facebook also came out with another library know as Data Loader. Data Loader works wonderfully with GraphQL and is an add on that a developer can highly utilize. What Data Loader does is allows the developer to point to a data source they wish to pull data from: API's, Databases, etc. GraphQL allows these data loaders to be combined these multiple sources under the same roof! This allows the developer to create a single source acting as a micro service! Now, Data Loader loads the data being requested and then caches the result for that particular type of object/requests. Now when a request is being performed and the data loader encounters the same data record, is returns that cached object instead of going back the acutal data source (API, DB).

Back the original scenario: The advisor make a single request to the memberships api, and with the query allowing the multiple types to be included, it can peek into the course, user, and data source in one reuest. Now since each data loader points to the appropriate REST API endpoint, if the records are not in that particular loader, it will make the call for the end user behind the scenes. So, the 1 request for the end user is still 30+ in the backend upon first occurence, but subsequent calls to any of those records at any time will be delivered by the cache! Unless the user or by design clears the cache, that data will remain in the cached memory. 



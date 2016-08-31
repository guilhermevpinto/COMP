# PROJECT TITLE: Finite Automata Operations
## GROUP: 2FAOPS
```
NAME1: António Ramadas, NR1: 201303568, GRADE1: 20.0, CONTRIBUTION1: 25%

NAME2: Guilherme Pinto, NR2: 201305803, GRADE2: 20.0, CONTRIBUTION2: 25%

NAME3: José Pedro Teles, NR3: 201305101, GRADE3: 20.0, CONTRIBUTION3: 25%

NAME4: Rui Vilares, NR4: 201207046, GRADE4: 20.0, CONTRIBUTION4: 25%
```
###SUMMARY

The developed project consists in a single webpage application with the intention to provide the result from an operation between multiple finite automatas. It includes the definition of a **DSL** ( _Domain-Specific Language_ ) to analyze, interpret and calculate the expressions relative to the operations over finite automatas. The supported operations are: x (multiply), . (concatenate), not (complement), rev (reverse), int (intersection), and + (union).

The final product must be able to upload multiple DOT files, each one containing a finite automata, and process an operation given by the user. The program should alert the user with a success message or an error alert, if any mistake on the input data was detected. It should also be possible to dump the resultant FA into a DOT file, downloadable by the user.

The development of a web application is ideal for this project, improving the interaction with the user and offering the best visual output, using [GraphViz](http://www.graphviz.org/), an open source graph visualization framework, with the features we required.

This project can be executed by opening index.html, but to run the examples it is necessary to host the project on a server (or simulate one with tools like [Mongoose](https://backend.cesanta.com/products.shtml) or [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb).

###DEALING WITH SYNTACTIC ERRORS

The project covers two syntactic analysis: the DOT file data and the operation expression, written by the user.

The analysis of the DOT file is processed by the GraphViz framework, so, if the syntax is not correct, the tool detects it and a warning is shown to the user. Relatively to the expression's analysis, an **AST** ( _Abstract Syntax Tree_ ) is created, in order to boost the processing of the query. The parser interprets the message and builds a detailled Tree including: 

* The definiton of a finite automata with the prefix 'FA', followed by a Identifier and an equals sign ("="), which can be used to assign a finite automata previously uploaded or the result of an operation expression;
* The definition of the operations: x (multiply), . (concatenate), not (complement), rev (reverse), int (intersection), and + (union);
* The definition of the precedence, implementing the priority induced by the parentheses;
* The definition of a DUMP instruction, that outputs the result of and operation and creates a DOT file to be downloaded by the user;
* The **AST** doesn't assume any kind of precendence between operations, so the expression is calculated from left to right;
* Although any operation as higher priority than any other the parentheses implementation makes it possible to associate a precedential sub-calculation, in order to achieve certain desired results.

Example:
```
FA A = new("A.dot");
FA B = new("B.dot");
FA C = not(A int B);
C.dump("dot");
```

If any error occurs during the build of the **AST**, the process is stopped and an error message is displayed.


###SEMANTIC ANALYSIS

The semantic analysis is executed like the sintactic analysis: the DOT file is automatically processed by the GraphViz tool and the expression sentence is validated by code that is included during the syntactic analysis, in order to detect semantic faults. 

In this case, the main and single aspect to be semantically interpreted is the declaration of finite automatas during the user's input and the validation of filename's used, which should match to the ones previously uploaded to the page.


###CODE GENERATION

The generated code, in this project, only consists in parsing the resultant finite automata of the expression executed and originate its corresponding DOT file representation.


###OVERVIEW

Since the start, the proposed challenge was to devellop a product that could be helpful to others and, consequently, have some utility. Given the idea, we had the plan to create a simple web application with all the required functionallities proposed on the project's description, but also easy and fast to use, displaying the information as clear as possible. With GraphViz, and using web technologies, we had all the material needed to create the desired product.

For the operations to be possible, it was necessary to detect wether the given DOT file was carrying a NFA and, if so, convert it to the equivalent DFA. The lexical, syntactic and semantic analysis were all implemented using _Javascript_, creating **TOKENS** to register the key-info that would be used in the **AST** and global variables to memorize the names of the uploaded files in order to check if the operation sentence is valid.

The generated result usually ends up with some redundant data, like extra _Dead States_ which we manage to merge and represent in a single _Dead State_. We are also proud to implement the precedence in the user's expression, which allows him/her a better interaction with the program in order to retrieve the desired calculation.

We consider to have accomplished a considerably good project, capable of reaching the the ceilling of the grade assigned to it.

###TASK DISTRIBUTION

**Antonio Ramadas** - Lexical Analysis, Semantical Analysis, Concatenation, NFA to DFA Conversion,, Tree Processing, Code Revision.

**Guilherme Pinto** - Syntactic Analysis and construction of the respective AST, Union, Intersection, Cross-Product, Code Revision.

**José Pedro Teles** - DOT file integration, Dump operation, Multiplication, Use Case Creation, Website support, GraphViz adaptation.

**Rui Vilares** - Overall website devellopment and maintenance, Reverse, Complement, Use Case Creation, GraphViz adaptation.

###PROS

* Simple interface and easy to use;
* Good quality of the output;
* Efficient proccessing and analysis of the specified language;
* Can be used as a tool to support academic courses;
* Implemmented precedence between operations using parentheses.
* Easy to edit uploaded files in the Graphical User Interface

###CONS

* Missing DFA minimization.
# COMP
# COMP
# COMP
# COMP

/*** SCHEMA ***/
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLUnionType,
} from "graphql";

const DogData = new GraphQLObjectType({
  name: "DogData",
  fields: {
    dogData: { type: GraphQLString },
  },
});

const CatData = new GraphQLObjectType({
  name: "CatData",
  fields: {
    catData: { type: GraphQLString },
  },
});

const PetData = new GraphQLUnionType({
  name: "PetData",
  types: [DogData, CatData],
  resolveType(value) {
    if (value.dogData) {
      return "DogData";
    }
    if (value.catData) {
      return "CatData";
    }
  },
});

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    pet: { type: GraphQLString },
    data: { type: PetData },
  },
});

const peopleData = [
  { id: 1, name: "John Smith", pet: "dog", data: { dogData: "dogdogdog" } },
  { id: 2, name: "Sara Smith", pet: "cat", data: { catData: "catcatcat" } },
  { id: 3, name: "Budd Deey", pet: "dog", data: { dogData: "dogdogdog" } },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPerson: {
      type: PersonType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: function (_, { name }) {
        const person = {
          id: peopleData[peopleData.length - 1].id + 1,
          name,
          kind: "dog",
          data: { dogData: "dogdogdog" },
        };

        peopleData.push(person);
        return person;
      }
    },
  },
});

export const schema = new GraphQLSchema({ query: QueryType, mutation: MutationType });

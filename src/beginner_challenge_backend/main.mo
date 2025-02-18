import Result "mo:base/Result";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Map "mo:map/Map";
import Vector "mo:vector";
import { phash } "mo:map/Map";
import { nhash } "mo:map/Map";

actor {

    stable var nextUserId : Nat = 0;
    stable var userIdMap : Map.Map<Principal, Nat> = Map.new<Principal, Nat>();
    stable var userProfileMap : Map.Map<Nat, Text> = Map.new<Nat, Text>();
    stable var userResultsMap : Map.Map<Nat, Vector.Vector<Text>> = Map.new<Nat, Vector.Vector<Text>>();

    public query ({ caller }) func getUserProfile() : async Result.Result<{ id : Nat; name : Text }, Text> {

        switch (Map.get(userIdMap, phash, caller)) {
            case (?userId) {
                switch (Map.get(userProfileMap, nhash, userId)) {
                    case (?userName) {
                        return #ok({ id = userId; name = userName });
                    };
                    case (_) {
                        return #err("User profile not found");
                    };
                };
            };
            case (_) {
                return #err("User not found");
            };
        };

    };

    public shared ({ caller }) func setUserProfile(name : Text) : async Result.Result<{ id : Nat; name : Text }, Text> {

        switch (Map.get(userIdMap, phash, caller)) {
            case (?userId) {
                return #err("User profile already exists id: " # Nat.toText(userId));
            };
            case (_) {};
        };

        Map.set(userIdMap, phash, caller, nextUserId);
        Map.set(userProfileMap, nhash, nextUserId, name);

        let userId = nextUserId;
        nextUserId := nextUserId + 1;

        return #ok({ id = userId; name = name });

    };

    public shared ({ caller }) func addUserResult(result : Text) : async Result.Result<{ id : Nat; results : [Text] }, Text> {

        switch (Map.get(userIdMap, phash, caller)) {
            case (?userId) {
                let handleResult = func (results : Vector.Vector<Text>) : Result.Result<{ id : Nat; results : [Text] }, Text> {
                    Vector.add(results, result);
                    Map.set(userResultsMap, nhash, userId, results);
                    return #ok({ id = userId; results = Vector.toArray(results) });
                };
                switch(Map.get(userResultsMap, nhash, userId)) {
                    case (?results) {
                        return handleResult(results);
                    };
                    case (_) {
                        return handleResult(Vector.new<Text>());
                    };
                };
            };
            case (_) {
                return #err("User not found");
            };
        };

    };

    public query ({ caller }) func getUserResults() : async Result.Result<{ id : Nat; results : [Text] }, Text> {
        
        switch (Map.get(userIdMap, phash, caller)) {
            case (?userId) {
                let handleResult = func (results : Vector.Vector<Text>) : Result.Result<{ id : Nat; results : [Text] }, Text> {
                    return #ok({ id = userId; results = Vector.toArray(results) });
                };
                switch(Map.get(userResultsMap, nhash, userId)) {
                    case (?results) {
                        return handleResult(results);
                    };
                    case (_) {
                        return handleResult(Vector.new<Text>());
                    };
                };
            };
            case (_) {
                return #err("User not found");
            };
        };
        
    };
};

/**
 * Module     : token.mo
 * Copyright  : 2021 Hellman Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : Hellman Team - Leven
 * Stability  : Experimental
 */

import MultiCanvas "../multiCanvas/multiCanvas";
import AloneCanvas "../aloneCanvas/aloneCanvas";
import IC0 "../common/IC0";
import WICP "../common/WICP";
import Types "../common/types";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import HashMap "mo:base/HashMap";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Cycles "mo:base/ExperimentalCycles";

shared(msg)  actor class Factory (owner_: Principal, feeTo_: Principal, wicpCanisterId_: Principal) = this {

    type CanvasView = Types.CanvasView;
    type CreateCanvasResponse = Types.CreateCanvasResponse;
    type WICPActor = WICP.WICPActor;
    private stable var owner: Principal = owner_;
    private stable var dimension: Nat = Types.DIMENSION;
    private stable var createCanvasFee: Nat = Types.CREATECANISTER_FEE;
    private stable var feeTo: Principal = feeTo_;
    private stable var WICPCanisterActor: WICPActor = actor(Principal.toText(wicpCanisterId_));

    private stable var controlCanisterList : [Principal] = [];
    private var mapCanvasList = HashMap.HashMap<Principal, [var Principal]>(1, Principal.equal, Principal.hash);

    public shared(msg) func createMultiPixelCanvas() : async CreateCanvasResponse {

        let transferResult = await WICPCanisterActor.transferFrom(msg.caller, feeTo, createCanvasFee);
        switch(transferResult){
            case(#ok(b)) {};
            case(#err(errText)){
                return #err(errText);
            };
        };
        let newCanvas = await MultiCanvas.MultiCanvas(owner, msg.caller, Principal.fromActor(WICPCanisterActor), dimension);
        let canvasCid = Principal.fromActor(newCanvas);
        let canResView = await newCanvas.getCanvasView();
        await modityController(canvasCid);
        addCanvasToUser(msg.caller, canvasCid);
        addCanvasIdToControllerList(canvasCid);
        return #ok(canResView);
    };

    public shared(msg) func createAlonePixelCanvas() : async CreateCanvasResponse {
        
        let transferResult = await WICPCanisterActor.transferFrom(msg.caller, feeTo, createCanvasFee);
        switch(transferResult){
            case(#ok(b)) {};
            case(#err(errText)){
                return #err(errText);
            };
        };
        let newCanvas = await AloneCanvas.AloneCanvas(owner, msg.caller, feeTo, Principal.fromActor(WICPCanisterActor), dimension);
        let canvasCid = Principal.fromActor(newCanvas);
        let canResView = await newCanvas.getCanvasView();
        await modityController(canvasCid);
        addCanvasToUser(msg.caller, canvasCid);
        addCanvasIdToControllerList(canvasCid);
        return #ok(canResView);
    };

    public shared(msg) func getCanvasCanisterStatus(canisterId: Principal): async ?IC0.CanisterStatus {

        switch( Array.find( controlCanisterList, func (prinId: Principal): Bool { prinId == canisterId } ) ) {
            case (?id) {
                let param: IC0.CanisterId = {
                    canister_id = id;
                };
                let status = await IC0.IC.canister_status(param);
                return ?status;
            };
            case(_) {
                return null;
            };
        };
    };

    public shared(msg) func modifyCreateCanvasFee(createFee: Nat) : async () {
        assert(msg.caller == owner);
        createCanvasFee := createFee;
    };

    public shared(msg) func setWICPCanisterId(wicpCanisterId: Principal) : async Bool {
        assert(msg.caller == owner_);
        WICPCanisterActor := actor(Principal.toText(wicpCanisterId));
        return true;
    };

    public shared(msg) func modifyOwner(newOwner: Principal) : async () {
        assert(msg.caller == owner);
        owner := newOwner;
    };

    public shared(msg) func modifyDimension(newDimension: Nat) : async Bool {
        assert(msg.caller == owner);
        dimension := newDimension;
        return true;
    };

    public func donateCircles() : async Nat {
        let available = Cycles.available();
        let accepted = Cycles.accept(available);
        return accepted;
    };

    public query func balanceCycles() : async Nat {
        return Cycles.balance();
    };

    public query func getWICPCanisterId() : async Principal {
        Principal.fromActor(WICPCanisterActor)
    };

    private func addCanvasToUser(who: Principal, canisterId: Principal) {
        switch(mapCanvasList.get(who)) {
            case (?canvasList) {
                switch( Array.find(Array.freeze(canvasList), func (prinId: Principal): Bool { prinId == canisterId } ) ) {
                    case (?id) {};
                    case(_) {
                        var canvasNewList : [var Principal] = Array.thaw(Array.append(Array.freeze(canvasList), Array.make(canisterId)));
                        mapCanvasList.put(who, canvasNewList);
                    }
                }
            };
            case (_) {
                mapCanvasList.put(who, Array.thaw(Array.make(canisterId)));
            }
        }
    };

    private func addCanvasIdToControllerList(canisterId: Principal) {

        if( Option.isNull(Array.find(controlCanisterList, func (prinId: Principal): Bool { prinId == canisterId } )) ){
            controlCanisterList := Array.append<Principal>(controlCanisterList, Array.make(canisterId));
        };
    };

    private func modityController(canisterId: Principal): async () {

        let controllers: ?[Principal] = ?[owner, Principal.fromActor(this)];
        let settings: IC0.CanisterSettings = {
            controllers = controllers;
            compute_allocation = null;
            memory_allocation = null;
            freezing_threshold = null;
        };
        let params: IC0.UpdateSettingsParams = {
            canister_id = canisterId;
            settings = settings;
        };
        await IC0.IC.update_settings(params);
    };

}
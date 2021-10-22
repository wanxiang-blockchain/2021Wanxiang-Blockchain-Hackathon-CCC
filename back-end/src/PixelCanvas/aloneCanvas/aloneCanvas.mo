/**
 * Module     : token.mo
 * Copyright  : 2021 Hellman Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : Hellman Team - Leven
 * Stability  : Experimental
 */
 
import HashMap "mo:base/HashMap";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Cycles "mo:base/ExperimentalCycles";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Iter "mo:base/Iter";
import Types "../common/types";
import WICP "../common/WICP";


shared(msg) actor class AloneCanvas(_owner : Principal, _createUser : Principal,
                            _feeTo : Principal, _wicpCanisterId: Principal, _dimension: Nat) = this {
    
    type Position = Types.Position;
    type Color = Types.Color;
    type Result<T,E> = Result.Result<T,E>;
    type DrawResponse = Types.DrawResponse;
    type CanvasState = Types.CanvasState;
    type CanvasView = Types.CanvasView;
    type WICPActor = WICP.WICPActor;

    private stable var owner: Principal = _owner;          // real owner of this canvas, the creator of canister factory
    private stable var nftOwner: Principal = _createUser;   //the user create this canvas
    private stable var feeTo: Principal = _feeTo;
    private stable var dimension: Nat = _dimension;         //canvas's width and length
    private stable var basicOperatePrice: Nat = Types.BASCIOPERATING_PRICE;     //fee of basic operate
    private stable var totalWorth: Nat = 0;
    private stable var isNFTDrawOver: Bool = false;
    private stable var WICPCanisterActor: WICPActor = actor(Principal.toText(_wicpCanisterId));

    private stable var positionState : [(Position, Color)] = [];
    private var positionMap : HashMap.HashMap<Position, Color> = HashMap.fromIter(positionState.vals(), 0, Types.equal, Types.hash);

    system func preupgrade() {
        positionState := Iter.toArray(positionMap.entries());
    };

    system func postupgrade() {
        positionState := [];
    };

    public shared(msg) func drawPixel(pos: Position, color: Color): async DrawResponse {
        
        assert(msg.caller == nftOwner and (not isNFTDrawOver) and
                pos.x < dimension and pos.y < dimension);
        
        let transferResult = await WICPCanisterActor.transferFrom(msg.caller, feeTo, basicOperatePrice);
        switch(transferResult){
            case(#ok(b)) {};
            case(#err(errText)){
                return #err(errText);
            };
        };

        positionMap.put(pos, color);
        totalWorth += basicOperatePrice;
        
        #ok(true)
    };

    public shared(msg) func drawOver(): async Bool {
        assert(msg.caller == nftOwner);
        isNFTDrawOver := true;
        return true;
    };

    public func donateCircles() : async Nat {
        let available = Cycles.available();
        assert(available > 0);
        let accepted = Cycles.accept(available);
        return accepted;
    };

    public query func getNFTWorth() : async Nat {
        totalWorth
    };

    public query func balanceCycles() : async Nat {
        Cycles.balance()
    };

    public query func queryNFTOwner() : async Principal {
        return nftOwner;
    };

    public query func getCanvasView(): async CanvasView {
        return canvas_state_to_view();
    };

    private func canvas_state_to_view(): CanvasView {
        let canResView = {
            prinId = Principal.fromActor(this);
            dimension = dimension;
            last_updated = 0;
            changeTotal = 0;
            expiring = false;
        };
        return canResView;
    };
}
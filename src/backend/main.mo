import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import AccessControl "./authorization/access-control";
import MixinAuth "./authorization/MixinAuthorization";
import MixinStorage "./blob-storage/Mixin";

actor IndieBloodlineEsports {

  let _accessControlState : AccessControl.AccessControlState = AccessControl.initState();
  include MixinAuth(_accessControlState);
  include MixinStorage();

  public type Tournament = {
    id : Nat;
    title : Text;
    game : Text;
    date : Text;
    prizePool : Text;
    status : Text;
    registrationUrl : Text;
    bannerImageId : ?Text;
    sortOrder : Int;
  };

  public type GalleryItem = {
    id : Nat;
    caption : Text;
    imageId : ?Text;
    sortOrder : Int;
  };

  public type SiteInfo = {
    aboutText : Text;
    missionText : Text;
    contactEmail : Text;
    facebookUrl : Text;
    discordUrl : Text;
    youtubeUrl : Text;
    instagramUrl : Text;
    twitterUrl : Text;
    phone : Text;
  };

  var nextTournamentId : Nat = 1;
  var nextGalleryId : Nat = 1;
  let _tournaments : Map.Map<Nat, Tournament> = Map.empty<Nat, Tournament>();
  let _galleryItems : Map.Map<Nat, GalleryItem> = Map.empty<Nat, GalleryItem>();
  var _siteInfo : SiteInfo = {
    aboutText = "Indie Bloodline Esports is a premier tournament organizing company dedicated to bringing competitive gaming to the community.";
    missionText = "Our mission is to grow the esports ecosystem by hosting fair, exciting, and professionally managed tournaments.";
    contactEmail = "contact@indiebloodline.gg";
    facebookUrl = "https://facebook.com/indiebloodlineesports";
    discordUrl = "https://discord.gg/indiebloodline";
    youtubeUrl = "https://youtube.com/@indiebloodlineesports";
    instagramUrl = "https://instagram.com/indiebloodlineesports";
    twitterUrl = "https://twitter.com/indiebloodline";
    phone = "+63 912 345 6789";
  };

  public query func getTournaments() : async [Tournament] {
    let pairs = _tournaments.toArray();
    pairs.map(func((_, v) : (Nat, Tournament)) : Tournament { v })
  };

  public query func getGalleryItems() : async [GalleryItem] {
    let pairs = _galleryItems.toArray();
    pairs.map(func((_, v) : (Nat, GalleryItem)) : GalleryItem { v })
  };

  public query func getSiteInfo() : async SiteInfo {
    _siteInfo
  };

  public shared ({ caller }) func addTournament(
    title : Text,
    game : Text,
    date : Text,
    prizePool : Text,
    status : Text,
    registrationUrl : Text,
    bannerImageId : ?Text,
    sortOrder : Int,
  ) : async Nat {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let id = nextTournamentId;
    let t : Tournament = { id; title; game; date; prizePool; status; registrationUrl; bannerImageId; sortOrder };
    _tournaments.add(id, t);
    nextTournamentId += 1;
    id
  };

  public shared ({ caller }) func updateTournament(
    id : Nat,
    title : Text,
    game : Text,
    date : Text,
    prizePool : Text,
    status : Text,
    registrationUrl : Text,
    bannerImageId : ?Text,
    sortOrder : Int,
  ) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let t : Tournament = { id; title; game; date; prizePool; status; registrationUrl; bannerImageId; sortOrder };
    _tournaments.add(id, t);
  };

  public shared ({ caller }) func deleteTournament(id : Nat) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    _tournaments.remove(id);
  };

  public shared ({ caller }) func addGalleryItem(
    caption : Text,
    imageId : ?Text,
    sortOrder : Int,
  ) : async Nat {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let id = nextGalleryId;
    let g : GalleryItem = { id; caption; imageId; sortOrder };
    _galleryItems.add(id, g);
    nextGalleryId += 1;
    id
  };

  public shared ({ caller }) func updateGalleryItem(
    id : Nat,
    caption : Text,
    imageId : ?Text,
    sortOrder : Int,
  ) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let g : GalleryItem = { id; caption; imageId; sortOrder };
    _galleryItems.add(id, g);
  };

  public shared ({ caller }) func deleteGalleryItem(id : Nat) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    _galleryItems.remove(id);
  };

  public shared ({ caller }) func updateSiteInfo(info : SiteInfo) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    _siteInfo := info;
  };
};

import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "./authorization/access-control";
import MixinAuth "./authorization/MixinAuthorization";
import MixinStorage "./blob-storage/Mixin";

actor IndieBloodlineEsports {

  let _accessControlState : AccessControl.AccessControlState = AccessControl.initState();
  include MixinAuth(_accessControlState);
  include MixinStorage();

  // ─── Existing Types ───────────────────────────────────────────────────────

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

  // ─── Player Types ─────────────────────────────────────────────────────────

  public type PlayerStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Player = {
    id : Nat;
    username : Text;
    uid : Text;
    gameAccountType : Text;
    gameAccountEmail : Text;
    gameAccountPassword : Text;
    screenshotBlobId : ?Text;
    screenRecordBlobId : ?Text;
    gameplayLevel : Text;
    gameplayDescription : Text;
    guildName : Text;
    playStyles : [Text];
    status : PlayerStatus;
    rank : Nat;
    wins : Nat;
    topPlacements : Nat;
    tournamentsJoined : [Nat];
    createdAt : Int;
  };

  public type PlayerPublic = {
    id : Nat;
    username : Text;
    uid : Text;
    gameAccountType : Text;
    gameplayLevel : Text;
    gameplayDescription : Text;
    guildName : Text;
    playStyles : [Text];
    status : PlayerStatus;
    rank : Nat;
    wins : Nat;
    topPlacements : Nat;
    tournamentsJoined : [Nat];
    createdAt : Int;
  };

  // ─── State ──────────────────────────────────────────────────────────────

  var nextTournamentId : Nat = 1;
  var nextGalleryId : Nat = 1;
  var nextPlayerId : Nat = 1;

  let _tournaments : Map.Map<Nat, Tournament> = Map.empty<Nat, Tournament>();
  let _galleryItems : Map.Map<Nat, GalleryItem> = Map.empty<Nat, GalleryItem>();
  let _players : Map.Map<Nat, Player> = Map.empty<Nat, Player>();
  let _sessions : Map.Map<Text, Nat> = Map.empty<Text, Nat>();
  let _usernameLookup : Map.Map<Text, Nat> = Map.empty<Text, Nat>();
  let _tournamentJoins : Map.Map<Nat, [Nat]> = Map.empty<Nat, [Nat]>();

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

  // ─── Admin Key ────────────────────────────────────────────────────────────
  // Matches the ADMIN_TOKEN constant in the frontend session hook.
  let ADMIN_KEY : Text = "admin_local_token";

  func isAdminKey(key : Text) : Bool { key == ADMIN_KEY };

  // ─── Helpers ─────────────────────────────────────────────────────────────

  func toPublic(p : Player) : PlayerPublic {
    {
      id = p.id;
      username = p.username;
      uid = p.uid;
      gameAccountType = p.gameAccountType;
      gameplayLevel = p.gameplayLevel;
      gameplayDescription = p.gameplayDescription;
      guildName = p.guildName;
      playStyles = p.playStyles;
      status = p.status;
      rank = p.rank;
      wins = p.wins;
      topPlacements = p.topPlacements;
      tournamentsJoined = p.tournamentsJoined;
      createdAt = p.createdAt;
    }
  };

  func generateToken(playerId : Nat, time : Int) : Text {
    "tok_" # playerId.toText() # "_" # time.toText()
  };


  func appendNat(arr : [Nat], item : Nat) : [Nat] {
    Array.tabulate<Nat>(arr.size() + 1, func(i : Nat) : Nat {
      if (i < arr.size()) { arr[i] } else { item }
    })
  };

  // ─── Tournament Functions ───────────────────────────────────────────────

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

  public shared func addTournamentAuth(
    adminKey : Text,
    title : Text,
    game : Text,
    date : Text,
    prizePool : Text,
    status : Text,
    registrationUrl : Text,
    bannerImageId : ?Text,
    sortOrder : Int,
  ) : async Nat {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    let id = nextTournamentId;
    let t : Tournament = { id; title; game; date; prizePool; status; registrationUrl; bannerImageId; sortOrder };
    _tournaments.add(id, t);
    nextTournamentId += 1;
    id
  };

  public shared func updateTournamentAuth(
    adminKey : Text,
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
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    let t : Tournament = { id; title; game; date; prizePool; status; registrationUrl; bannerImageId; sortOrder };
    _tournaments.add(id, t);
  };

  public shared func deleteTournamentAuth(adminKey : Text, id : Nat) : async () {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    _tournaments.remove(id);
  };

  public shared func addGalleryItemAuth(
    adminKey : Text,
    caption : Text,
    imageId : ?Text,
    sortOrder : Int,
  ) : async Nat {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    let id = nextGalleryId;
    let g : GalleryItem = { id; caption; imageId; sortOrder };
    _galleryItems.add(id, g);
    nextGalleryId += 1;
    id
  };

  public shared func updateGalleryItemAuth(
    adminKey : Text,
    id : Nat,
    caption : Text,
    imageId : ?Text,
    sortOrder : Int,
  ) : async () {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    let g : GalleryItem = { id; caption; imageId; sortOrder };
    _galleryItems.add(id, g);
  };

  public shared func deleteGalleryItemAuth(adminKey : Text, id : Nat) : async () {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    _galleryItems.remove(id);
  };

  public shared func updateSiteInfoAuth(adminKey : Text, info : SiteInfo) : async () {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    _siteInfo := info;
  };

  // Keep old caller-based functions for backward compatibility
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

  // ─── Player Registration ──────────────────────────────────────────────────

  public shared func submitRegistration(
    username : Text,
    uid : Text,
    gameAccountType : Text,
    gameAccountEmail : Text,
    gameAccountPassword : Text,
    screenshotBlobId : ?Text,
    screenRecordBlobId : ?Text,
    gameplayLevel : Text,
    gameplayDescription : Text,
    guildName : Text,
    playStyles : [Text],
  ) : async Nat {
    switch (_usernameLookup.get(username)) {
      case (?_) { Runtime.trap("Username already taken") };
      case (null) {};
    };
    let id = nextPlayerId;
    let player : Player = {
      id;
      username;
      uid;
      gameAccountType;
      gameAccountEmail;
      gameAccountPassword;
      screenshotBlobId;
      screenRecordBlobId;
      gameplayLevel;
      gameplayDescription;
      guildName;
      playStyles;
      status = #pending;
      rank = 0;
      wins = 0;
      topPlacements = 0;
      tournamentsJoined = [];
      createdAt = Time.now();
    };
    _players.add(id, player);
    _usernameLookup.add(username, id);
    nextPlayerId += 1;
    id
  };

  // ─── Player Auth ─────────────────────────────────────────────────────────

  public shared func loginPlayer(username : Text, password : Text) : async ?Text {
    switch (_usernameLookup.get(username)) {
      case (null) { null };
      case (?playerId) {
        switch (_players.get(playerId)) {
          case (null) { null };
          case (?player) {
            if (player.gameAccountPassword != password) { return null };
            if (player.status != #approved) { return null };
            let token = generateToken(playerId, Time.now());
            _sessions.add(token, playerId);
            ?token
          };
        };
      };
    };
  };

  public query func getPlayerByToken(token : Text) : async ?PlayerPublic {
    switch (_sessions.get(token)) {
      case (null) { null };
      case (?playerId) {
        switch (_players.get(playerId)) {
          case (null) { null };
          case (?p) { ?toPublic(p) };
        };
      };
    };
  };

  public shared func joinTournament(token : Text, tournamentId : Nat) : async Bool {
    switch (_sessions.get(token)) {
      case (null) { false };
      case (?playerId) {
        switch (_players.get(playerId)) {
          case (null) { false };
          case (?player) {
            let alreadyJoined = player.tournamentsJoined.vals().filterMap(func(n : Nat) : ?Nat { if (n == tournamentId) { ?n } else { null } }).size() > 0;
            if (alreadyJoined) { return true };
            let updated : Player = {
              player with
              tournamentsJoined = appendNat(player.tournamentsJoined, tournamentId);
            };
            _players.add(playerId, updated);
            let current = switch (_tournamentJoins.get(tournamentId)) {
              case (null) { [] };
              case (?arr) { arr };
            };
            _tournamentJoins.add(tournamentId, appendNat(current, playerId));
            true
          };
        };
      };
    };
  };

  public query func getLeaderboard() : async [PlayerPublic] {
    let all = _players.toArray();
    let approved = all.filter(func((_, p) : (Nat, Player)) : Bool {
      p.status == #approved and p.rank > 0
    });
    let sorted = approved.sort(func((_, a) : (Nat, Player), (_, b) : (Nat, Player)) : { #less; #equal; #greater } {
      if (a.rank < b.rank) { #less } else if (a.rank > b.rank) { #greater } else { #equal }
    });
    sorted.map(func((_, p) : (Nat, Player)) : PlayerPublic { toPublic(p) })
  };

  public query func getPlayerProfile(playerId : Nat) : async ?PlayerPublic {
    switch (_players.get(playerId)) {
      case (null) { null };
      case (?p) {
        if (p.status != #approved) { null } else { ?toPublic(p) }
      };
    };
  };

  // ─── Admin Player Functions (token-based) ─────────────────────────────────

  public shared func getPendingRegistrationsAuth(adminKey : Text) : async [Player] {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    let all = _players.toArray();
    let pending = all.filter(func((_, p) : (Nat, Player)) : Bool { p.status == #pending });
    pending.map(func((_, p) : (Nat, Player)) : Player { p })
  };

  public shared func getAllPlayersAuth(adminKey : Text) : async [Player] {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    let all = _players.toArray();
    all.map(func((_, p) : (Nat, Player)) : Player { p })
  };

  public shared func approvePlayerAuth(adminKey : Text, playerId : Nat) : async () {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    switch (_players.get(playerId)) {
      case (null) {};
      case (?p) {
        _players.add(playerId, { p with status = #approved });
      };
    };
  };

  public shared func rejectPlayerAuth(adminKey : Text, playerId : Nat) : async () {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    switch (_players.get(playerId)) {
      case (null) {};
      case (?p) {
        _players.add(playerId, { p with status = #rejected });
      };
    };
  };

  public shared func setPlayerRankingAuth(adminKey : Text, playerId : Nat, rank : Nat) : async () {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    switch (_players.get(playerId)) {
      case (null) {};
      case (?p) {
        _players.add(playerId, { p with rank });
      };
    };
  };

  public shared func updatePlayerStatsAuth(adminKey : Text, playerId : Nat, wins : Nat, topPlacements : Nat) : async () {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    switch (_players.get(playerId)) {
      case (null) {};
      case (?p) {
        _players.add(playerId, { p with wins; topPlacements });
      };
    };
  };

  public shared func getTournamentJoinRequestsAuth(adminKey : Text, tournamentId : Nat) : async [PlayerPublic] {
    if (not isAdminKey(adminKey)) { Runtime.trap("Unauthorized: admin only") };
    let playerIds = switch (_tournamentJoins.get(tournamentId)) {
      case (null) { [] };
      case (?arr) { arr };
    };
    playerIds.filterMap(func(pid : Nat) : ?PlayerPublic {
      switch (_players.get(pid)) {
        case (null) { null };
        case (?p) { ?toPublic(p) };
      };
    })
  };

  // ─── Legacy caller-based Admin Player Functions ───────────────────────────

  public shared ({ caller }) func getPendingRegistrations() : async [Player] {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let all = _players.toArray();
    let pending = all.filter(func((_, p) : (Nat, Player)) : Bool { p.status == #pending });
    pending.map(func((_, p) : (Nat, Player)) : Player { p })
  };

  public shared ({ caller }) func getAllPlayers() : async [Player] {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let all = _players.toArray();
    all.map(func((_, p) : (Nat, Player)) : Player { p })
  };

  public shared ({ caller }) func approvePlayer(playerId : Nat) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    switch (_players.get(playerId)) {
      case (null) {};
      case (?p) {
        _players.add(playerId, { p with status = #approved });
      };
    };
  };

  public shared ({ caller }) func rejectPlayer(playerId : Nat) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    switch (_players.get(playerId)) {
      case (null) {};
      case (?p) {
        _players.add(playerId, { p with status = #rejected });
      };
    };
  };

  public shared ({ caller }) func setPlayerRanking(playerId : Nat, rank : Nat) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    switch (_players.get(playerId)) {
      case (null) {};
      case (?p) {
        _players.add(playerId, { p with rank });
      };
    };
  };

  public shared ({ caller }) func updatePlayerStats(playerId : Nat, wins : Nat, topPlacements : Nat) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    switch (_players.get(playerId)) {
      case (null) {};
      case (?p) {
        _players.add(playerId, { p with wins; topPlacements });
      };
    };
  };

  public shared ({ caller }) func getTournamentJoinRequests(tournamentId : Nat) : async [PlayerPublic] {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let playerIds = switch (_tournamentJoins.get(tournamentId)) {
      case (null) { [] };
      case (?arr) { arr };
    };
    playerIds.filterMap(func(pid : Nat) : ?PlayerPublic {
      switch (_players.get(pid)) {
        case (null) { null };
        case (?p) { ?toPublic(p) };
      };
    })
  };
};

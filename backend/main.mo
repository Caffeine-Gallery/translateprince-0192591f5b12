import Array "mo:base/Array";
import Text "mo:base/Text";

actor {
  stable var translations : [(Text, Text, Text)] = [];

  public func addTranslation(original : Text, translated : Text, language : Text) : async () {
    translations := Array.append(translations, [(original, translated, language)]);
  };

  public query func getTranslations() : async [(Text, Text, Text)] {
    translations
  };
}

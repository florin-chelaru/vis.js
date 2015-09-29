./bower_components/google-closure-library/closure/bin/build/closurebuilder.py \
  --root=bower_components/google-closure-library/closure/goog/ \
  --root=bower_components/google-closure-library/third_party/closure/goog/ \
  --root=third-party/bigwig/ --namespace="bigwig" --output_mode=compiled \
  --compiler_flags="--js=bower_components/google-closure-library/closure/goog/deps.js" \
  --compiler_flags="--js=third-party/bigwig/deps.js" \
  --compiler_jar=bower_components/closure-compiler/lib/vendor/compiler.jar \
  --compiler_flags="--compilation_level=SIMPLE_OPTIMIZATIONS" \
  
  > bigwig.min.js

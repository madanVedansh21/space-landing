from flask import Flask, request, jsonify
from kd_tree_correlator import MultimessengerCorrelator, create_sample_datasets

app = Flask(__name__)

@app.route('/correlate', methods=['POST'])
def correlate():
    input_data = request.json
    gw_df, grb_df = create_sample_datasets()
    correlator = MultimessengerCorrelator()
    correlator.load_data_from_dataframes(gw_df, grb_df)
    results = correlator.find_top_correlations(target_top_n=10)
    return jsonify(results.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(port=5000)